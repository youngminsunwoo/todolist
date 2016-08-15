
# puppet variables
$newuser = 'donal'


# new user and group for attendee
group { 'devops-course':
	ensure => 'present',
	gid    => '5001',
}

user { "${newuser}" :
	ensure           => 'present',
	gid				 => '5001',
	groups           => ['devops-course', 'docker', 'sudo'],
	home             => "/home/${newuser}",
	password         => '$1$VxPERwqX$VSyGYOp80BS4fQOjx0KPz.',
	password_max_age => '99999',
	password_min_age => '0',
	shell            => '/bin/zsh',
	uid              => '1010',
	managehome		 => true,
}->	

file { "/home/${newuser}":
	ensure 		=> 'directory',
	owner    	=> "${newuser}",
    group     	=> 'devops-course',
    require     => [ User["${newuser}"], Group['devops-course'], ],
    recurse 	=> true
}

user { 'devops' :
	ensure           => 'present',
	gid				 => '5001',
	groups           => ['devops-course', 'docker', 'sudo'],
	home             => "/home/devops",
}->	

file { "/share":
	ensure 		=> 'directory',
	owner    	=> "devops",
    group     	=> 'devops-course',
    require     => [ User['devops'], Group['devops-course'], ],
    recurse 	=> true,
    mode    	=> '0770',
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
package { ['vim', 'curl', 'wget', 'openssh-client', 'openssh-server', 'git-core', 'sl', 'fortune', 'cowsay']:
    ensure => present,
}


# nodejs install
class { '::nodejs':
	repo_url_suffix => 'node_4.x',
}->

file { '/usr/bin/node':
    ensure => 'link',
    target => '/usr/bin/nodejs',
    mode    => '0755',
}->

package { ['bower', 'grunt-cli', 'npm-cache']:
	ensure   => 'present',
	provider => 'npm',
}

# Jenkins install
include apt
apt::ppa { 'ppa:openjdk-r/ppa': }->
package { ['openjdk-7-jdk']:
    ensure 	=> present,
}

package { ['jenkins']:
    ensure 	=> present,
    require	=> [ Package['openjdk-7-jdk'], ],

}

user { 'jenkins' :
	ensure           => 'present',
	gid				 			 => '5001',
	groups           => ['devops-course', 'docker'], #TODO add docker group lab 5b
} ->

exec { 'gitconfig':
	command => "git config --global user.email \"jenkins@jenkins.ci\" && git config --global user.name \"jenkins\"'",
	user    => "jenkins"
}

exec { 'keygen':
	command => "/bin/bash -c 'sudo ../scripts/keygen-exchange.sh'",
}

