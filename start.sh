#!/usr/bin/env bash

echo $BASH_VERSION

# Place required Python package name in the $required array.
# DO NOT USE '_' (lower undersore in packages name
# Use '-' instead
required=("flask"\
          "flask-login"\
          "flask-sqlalchemy"\
          "flask-wtf"\
          "flask-bcrypt"\
          "flask-migrate"\
         )
needed=()
installed="$(pip3 list --format=freeze | cut -d '=' -f 1)"
ic=0

for i in ${required[@]}
do
    req=1
    for j in ${installed[@]}; do
        echo ${j,,}
        if [[ ${i,,} == ${j,,} ]]; then
            (( req-- ))
            break
        fi
    done
    
    if [[ $req -eq 1 ]]; then
        needed+=(${i,,})
    fi
done

for i in ${needed[@]}
do
    echo -e "\e[31mMissing package \e[43m$i\e[0m\e[39m"
    echo -e "\e[34mInstalling package $i using pip3\e[0m\e[39m"
    out_last=$(pip3 install "$i" | tail -1)
    echo -e "\e[42m $out_last\e[0m\e[39m"
done

export FLASK_APP=wsgi.py
export FLASK_ENV=development
export APP_CONFIG_FILE=config.py
flask run
