# Enable Nerd Fonts
set -g theme_nerd_fonts yes

# Initialize Starship (only once)
starship init fish | source

# FZF Configuration
if type -q fzf_configure_bindings
    fzf_configure_bindings \
        --directory=\cf \
        --history=\cr \
        --variables=\cv \
        --git_log=\e\cl \
        --git_status=\e\cs \
        --processes=\e\cp
end


# Git abbreviations
abbr -a g git
abbr -a gs 'git status'
abbr -a ga 'git add'
abbr -a gc 'git commit'
abbr -a gp 'git push'
abbr -a gd 'git diff'
abbr -a gl 'git log'


# Set display for WSLg
if set -q WSLG
    set -gx DISPLAY :0
else if test -f /etc/resolv.conf
    set -gx DISPLAY (grep nameserver /etc/resolv.conf | awk '{print $2}'):0
end

# Remove duplicate starship init
# set -gx PATH $PATH /usr/local/go/bin
# set -gx PATH /usr/local/go/bin $PATH
set -gx PATH /usr/local/go/bin $PATH

# bun
set -gx BUN_INSTALL "$HOME/.bun"
set -gx PATH $BUN_INSTALL/bin $PATH

# opencode
function opencode
    bun run --conditions=development /home/$USER/agents/opencode/packages/opencode/src/index.ts $argv
end

# Alias 'claude' for 'opencode'
abbr -a claude opencode

# pnpm
set -gx PNPM_HOME "/home/$USER/.local/share/pnpm"
if not string match -q -- $PNPM_HOME $PATH
  set -gx PATH "$PNPM_HOME" $PATH
end
# pnpm end

zoxide init fish | source

function cd
    z $argv
end


eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"


function bmad
    # Run bmad from any directory
    bun run /home/$USER/Github/BMAD-METHOD/tools/cli.js build -a $argv
end

function bmad-init
    npx bmad-method install $argv
end

function src_fish
    source ~/.config/fish/config.fish
end
