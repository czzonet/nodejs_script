#!/bin/sh
START=$(date +%s%N)
du -shc ./*>/tmp/du_output
END=$(date +%s%N)
echo "脚本完成耗时$(((END - START)/1000000)) MS"
