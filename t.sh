#!/bin/bash

required=('flask flask-login flask-sqlalchemy')
output="$(pip3 list --format=freeze | cut -d '=' -f 1)"
installed=()
ic=0

for i in ${output}
do
    installed[$ic]=${i,,}
    (( ic++ ))
done

echo ${installed[*]}
echo $ic
