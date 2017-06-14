# modules to include

include git

# puppet variables
$newuser = 'youngmin'


# new user and group for attendee
group { 'devops-course':
  ensure => 'present',
  gid    => '5001',
}

user { $newuser :
  ensure           => 'present',
  gid              => '5001',
  groups           => ['docker', 'devops-course', 'sudo'],
  home             => "/home/${newuser}",
  password         => '$1$z8zmiDfC$SruevtKUNY7kxWI.2Jb5D.', # note this is NOT your plain text password, use openssl generator as per instructions
  password_max_age => '99999',
  password_min_age => '0',
  shell            => '/bin/zsh',
  uid              => '1010',
  managehome       => true,
} ->

file { "/home/${newuser}":
  ensure  => 'directory',
  owner   => $newuser,
  group   => 'devops-course',
  require => [ User[$newuser], Group['devops-course'], ],
  recurse => true
}

file { ["/home/${newuser}/Desktop", '/home/devops/Desktop']:
  ensure  => 'directory',
  group   => 'devops-course',
  require => [ User[$newuser], User['devops'], Group['devops-course'], ],
  recurse => true,
  mode    => '0775'
}

user { 'devops' :
  ensure => 'present',
  gid    => '5001',
  groups => ['devops-course', 'docker', 'sudo'],
  home   => '/home/devops'
} ->

file { '/share':
  ensure  => 'directory',
  owner   => 'devops',
  group   => 'devops-course',
  require => [ User['devops'], ],
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
package { ['vim', 'curl', 'wget', 'openssh-client', 'openssh-server', 'git-core', 'cowsay', 'sl', 'fortune']:
  ensure => present,
}

# nodejs install...

# Jenkins install...
