#!/bin/bash

images=( "${@:2:$1}" ); shift "$(( $1 + 1 ))"

screenBreakpoints=()
while read i; do
  screenBreakpoints+=($i)
done <<<$(jq -c '.ImageContainerSrcs.sizes[][0]' src/ep.config.json | tr -d \")

imageSizes=()
while read i; do
  imageSizes+=($i)
done <<<$(jq -c '.ImageContainerSrcs.sizes[][1]' src/ep.config.json | tr -d \")

imageTypes=()
while read i; do
  imageTypes+=($i)
done <<<$(jq -c '.ImageContainerSrcs.types[]' src/ep.config.json | tr -d \")

for i in "${images[@]}";
  do

    mkdir ./$i/converted
    mkdir ./$i/converted/Placeholders

    for format in "${imageTypes[@]}";
      do
        mkdir ./$i/converted/$format
      done

    # Go into Image directory for easier understanding
    cd $i

    # Loop through all images in the Image directory
    for file in *; do
      # This means, do not run this code on a directory, only on a file (-f)
      if [[ -f $file ]]; then

        fileName=$(echo $file | cut -d'.' -f 1) # something.jpg -> something

        # Create placeholder and move to Placeholder folder
        # These options are temporary and definitely have room for improvement
        if [[ $file == *.png ]]; then
          # -strip gets rid unnecessary metadata
          # -quality 1 - 100, specifies image quality
          # -resize creates thumbnail like images 4096@ = 64x64 16384@ 128x128
          convert $file -strip -quality 1 -colors 255 -resize 4096@ .converted/Placeholders/$fileName.png
        else
          convert $file -strip -quality 20 -resize 16384@ ./converted/png/$fileName.jpg
        fi

        # Conversion to Next Gen formats, using solely imageMagick defaults.

        for format in "${imageTypes[@]}";
          do
            if [[ $format == webp ]]; then
              # resize and convert to webp
              i=0
              while [ $i -lt ${#imageSizes[*]} ]; do
                convert $file -quality 100 -resize ${imageSizes[$i]} ./converted/webp/$fileName-${screenBreakpoints[$i]}w.webp
                i=$(( $i + 1));
              done
            else
              # resize and convert to $format
              i=0
              while [ $i -lt ${#imageSizes[*]} ]; do
                convert $file -resize ${imageSizes[$i]} ./converted/$format/$fileName-${screenBreakpoints[$i]}w.$format
                i=$(( $i + 1));
              done
            fi
          done
      fi

    done

    # Go back down
    cd ../../..
  done

