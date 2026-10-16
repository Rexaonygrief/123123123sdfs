#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 ssh-user@server-or-ssh-alias" >&2
  echo "Example: $0 rezone-deploy@your-vps" >&2
  exit 2
fi

target="$1"
remote_dir="/srv/rezonevpn-updates"
build_dir="dist"
metadata="${build_dir}/latest.yml"

if [[ ! -s "$metadata" ]]; then
  echo "Missing ${metadata}; build the Windows NSIS installer first." >&2
  exit 1
fi

shopt -s nullglob
artifacts=("${build_dir}"/*.exe "${build_dir}"/*.blockmap)
if [[ ${#artifacts[@]} -eq 0 ]]; then
  echo "No Windows installer or blockmap found in ${build_dir}." >&2
  exit 1
fi

# Check that every installer filename referenced in latest.yml is in this build.
mapfile -t referenced_files < <(
  sed -nE 's/^[[:space:]]*(-[[:space:]]*)?(url|path):[[:space:]]*"?([^"[:space:]]+)"?[[:space:]]*$/\3/p' "$metadata" |
    sort -u
)
if [[ ${#referenced_files[@]} -eq 0 ]]; then
  echo "No installer filenames found in ${metadata}." >&2
  exit 1
fi

for filename in "${referenced_files[@]}"; do
  if [[ "$filename" == */* || "$filename" == *".."* || ! -s "${build_dir}/${filename}" ]]; then
    echo "Update metadata references a missing or unsafe file: ${filename}" >&2
    exit 1
  fi
done

ssh "$target" "test -d '${remote_dir}' && test -w '${remote_dir}'" || {
  echo "Remote directory ${remote_dir} must exist and be writable by ${target}." >&2
  exit 1
}

# Upload installer assets first, then publish metadata through an atomic rename.
scp -p "${artifacts[@]}" "${target}:${remote_dir}/"
scp -p "$metadata" "${target}:${remote_dir}/latest.yml.next"
ssh "$target" \
  "chmod 644 '${remote_dir}'/*.exe '${remote_dir}'/*.blockmap '${remote_dir}/latest.yml.next' && mv -f '${remote_dir}/latest.yml.next' '${remote_dir}/latest.yml'"

echo "Published update files to ${target}:${remote_dir}"