#!/bin/bash

eval "source env/bin/activate"

required=("flask"\
          "flask-login"\
          "flask-sqlalchemy"\
         )
needed=()
installed="$(pip3 list --format=freeze | cut -d '=' -f 1)"
ic=0

for i in ${required[@]}
do
    req=1
    for j in ${installed[@]}; do
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


export FLASK_APP=saien
export FLASK_ENV=development

flask run
