#!/bin/bash

arr1=( "${@:2:$1}" ); shift "$(( $1 + 1 ))"
arr2=( "${@:2:$1}" ); shift "$(( $1 + 1 ))"

for i in "${arr1[@]}";
  do

    mkdir ./$i/converted
    mkdir ./$i/converted/Placeholders

    for format in "${arr2[@]}";
      do
        if [[ $format == webp || jp2 || jpg || jxr ]]; then
          mkdir ./$i/converted/$format
        fi
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

        # TODO: Need to make images smaller too...

        # Conversion to Next Gen formats, using solely imageMagick defaults

        ## We need to downsize every single file...

        for format in "${arr2[@]}";
          do
            if [[ $format == webp ]]; then
              # resize and convert to webp
              convert $file -quality 100 -resize 620x620 ./converted/webp/$fileName-768w.webp
              convert $file -quality 100 -resize 490x490 ./converted/webp/$fileName-1092w.webp
              convert $file -quality 100 -resize 450x450 ./converted/webp/$fileName-2800w.webp
            else
              if [[ $format == jp2 || jpg || jxr ]]; then
                # resize and convert to $format
                convert $file -resize 620x620 ./converted/$format/$fileName-768w.$format
                convert $file -resize 490x490 ./converted/$format/$fileName-1092w.$format
                convert $file -resize 450x450 ./converted/$format/$fileName-2800w.$format
              fi
            fi
          done
      fi

    done

    # Go back down
    cd ../../..
  done

