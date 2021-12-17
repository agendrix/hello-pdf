#!/bin/bash
set -e

# Run the specified command using a subshell configured using the $SSH_KEY env var.
# This prevent the ssh-agent from persisting on the disk
COMMAND="printf '%s\n' \"$SSH_KEY\" | ssh-add - ; $@"
ssh-agent sh -c "$COMMAND"
