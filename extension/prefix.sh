
function prefix() {
    echo $1
    SUB="s|$1|sd-$1|g"
    echo $SUB
    find . -type f -name \*.vue -exec sed -i '' -e "s|$1|sd-$1|g" {} \;

}

# remove previously added prefixes
find . -type f -name \*.vue -exec sed -i '' -e "s/sd-//g" {} \;
prefix text-
prefix bg-
prefix font-
prefix flex
prefix flex-
prefix grid
prefix grid-
prefix hidden
prefix transform
prefix fixed
prefix inset-
prefix overflow-
prefix rounded-
prefix shadow-
prefix border-
prefix outline-
prefix divide-
prefix select-
prefix items-
prefix justify-
prefix space-
prefix cursor-
prefix max-
prefix whitespace-
prefix placeholder-
prefix ring-
prefix block
prefix absolute
prefix relative
prefix inline
prefix scroll-
prefix list-
prefix top-
prefix left-
prefix underline
prefix h-
prefix w-
prefix z-
prefix transition-
prefix p-
prefix pt-
prefix pb-
prefix px-
prefix py-
prefix pr-
prefix pl-
prefix m-
prefix mt-
prefix mb-
prefix mx-
prefix my-
prefix mr-
prefix ml-
