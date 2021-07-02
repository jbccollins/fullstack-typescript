
#!/bin/bash

# # Install xcode utils
# xcode-select --install

# # Install homebrew
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install the packages listed in the Brewfile
brew bundle

# # Get autocomplete scripts for git and hub
# curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash >> ~/.git.bashcompletion
# curl https://raw.githubusercontent.com/github/hub/master/etc/hub.bash_completion.sh >> ~/.hub.bashcompletion

# cat << EOF >> ~/.bash_profile
# if [ -f ~/.git.bashcompletion ]; then
#   . ~/.git.bashcompletion
# fi
# if [ -f ~/.hub.bashcompletion ]; then
#   . ~/.hub.bashcompletion
# fi

# # node
# if [[ ! -e ~/.nvm ]]; then
#   mkdir ~/.nvm
# elif [[ ! -d ~/.nvm ]]; then
#   echo "~/.nvm already exists but is not a directory" 1>&2
# else
#   echo "~/.nvm already exists. Not overwriting. This is not a problem, just letting you know :)"
# fi

# export NVM_DIR="$HOME/.nvm"
# [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
# [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
# EOF
