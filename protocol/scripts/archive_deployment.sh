
#!/bin/sh

# Set the path to your deployments directory
rootDir="./ignition/deployments"
outputFile="deployments.json"

# Initialize the JSON object
mkdir -p $rootDir

# Initialize an empty JSON object
echo "{}" > $outputFile

# Process each directory and update the JSON file
find $rootDir -mindepth 1 -maxdepth 1 -type d | while read dir; do
    folderName=$(basename "$dir")
    # Read and process JSON, then merge into the existing outputFile JSON
    jq -r --arg folderName "$folderName" \
        'reduce inputs as $in (.; .[$folderName] = ($in | with_entries(.key |= capture(".*#(?<newKey>.+)").newKey)))' \
        $outputFile "$dir/deployed_addresses.json" > temp.json && mv temp.json $outputFile
done

# Print the final JSON output to console
cat $outputFile
