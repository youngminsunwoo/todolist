# modules to include

include git

# puppet variables
$newuser = 'your.username.here'


# new user and group for attendee
group { 'devops-course':
  ensure => 'present',
  gid    => '5001',
}

user { "${newuser}" :
  ensure           => 'present',
  gid              => '5001',
  groups           => ['docker'],
  home             => "/home/${newuser}",
  password         => 'you.encryted.here', # note this is NOT your plain text password, use openssl generator as per instructions
  password_max_age => '99999',
  password_min_age => '0',
  shell            => '/bin/zsh',
  uid              => '1010',
  managehome       => true,
} ->

file { "/home/${newuser}":
  ensure  => 'directory',
  owner   => "${newuser}",
  group   => 'devops-course',
  require => [ User["${newuser}"], Group['devops-course'], ],
  recurse => true
}

file { "/share":
  ensure  => 'directory',
  owner   => "devops",
  group   => 'devops-course',
  require => [ User['devops'], Group['devops-course'], ],
  recurse => true
}

# oh-my-zsh
vcsrepo { "/home/${newuser}/.oh-my-zsh":
  ensure   => present,
  provider => git,
  source   => 'git://github.com/robbyrussell/oh-my-zsh.git',
} ->

file { "/home/${newuser}/.zshrc" :
  source => ["/home/${newuser}/.oh-my-zsh/templates/zshrc.zsh-template"],
}

# os packages
package { ['vim', 'curl', 'wget', 'openssh-client', 'openssh-server', 'git-core']:
  ensure => present,
}

# guest additions
package { 'virtualbox-guest-additions-iso':
  ensure => present
} ->

exec {'install guest additions':
  command => "/bin/bash -c 'sudo ../scripts/install-guest-additions.sh'",
  creates => "/share/.puppet-breadcrumbs/install-guest-additions"
}

# nodejs install...

# Jenkins install...

user { 'jenkins' :
  ensure => 'present',
  gid    => '5001',
  groups => ['devops-course', 'docker']
} ->

git::config { 'user.email':
  value => 'jenkins@jenkins.com',
  user  => 'jenkins'
} ->

git::config { 'user.name':
  value => 'jenkins',
  user  => 'jenkins'
} ->

exec { 'keygen':
  command => "/bin/bash -c 'sudo ../scripts/keygen-exchange.sh'",
}

