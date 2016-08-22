#!/usr/bin/env bash
# mounts and install guest additions
mkdir -p /mnt/guest-additions
mount -o loop /usr/share/virtualbox/VBoxGuestAdditions.iso /mnt/guest-additions
/mnt/guest-additions/runasroot.sh
mkdir -p /share/.puppet-breadcrumbs
touch /share/.puppet-breadcrumbs/install-guest-additions
umount /mnt/guest-additions