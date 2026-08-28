#!/bin/zsh
set -euo pipefail

script_dir="${0:A:h}"
web_dir="${script_dir:h}"
repo_dir="${web_dir:h}"
source_file="$repo_dir/docs/product/INTERVIEW_PRODUCT_GUIDE.md"
template_file="$script_dir/product-guide-template.html"
output_file="$web_dir/public/product-guide.html"

pandoc "$source_file" \
  --from=gfm \
  --to=html5 \
  --standalone \
  --toc \
  --toc-depth=3 \
  --template="$template_file" \
  --output="$output_file"

sed -i '' \
  -e 's|href="\./PRODUCT_SPEC\.md"|href="https://github.com/MrPPFruit/ai-script-production-workspace/blob/main/docs/product/PRODUCT_SPEC.md"|g' \
  -e 's|href="\./SCOPE_DECISIONS\.md"|href="https://github.com/MrPPFruit/ai-script-production-workspace/blob/main/docs/product/SCOPE_DECISIONS.md"|g' \
  -e 's|href="\./DEMO_SCRIPT\.md"|href="https://github.com/MrPPFruit/ai-script-production-workspace/blob/main/docs/product/DEMO_SCRIPT.md"|g' \
  "$output_file"

echo "Generated $output_file from $source_file"
