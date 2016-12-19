# Jenkins install...

include apt
apt::ppa { 'ppa:openjdk-r/ppa': }
package {'openjdk-7-jdk':
  ensure => present,
  require => Apt::Ppa['ppa:openjdk-r/ppa']
}

# Add jenkins package here !!


user { 'jenkins' :
 ensure => 'present',
 gid    => '5001',
 groups => ['devops-course', 'docker'], #TODO add docker group lab 5b
 home => '/var/lib/jenkins'
}

exec { 'keygen':
    command => "/bin/bash -c 'sudo ../scripts/keygen-exchange.sh'",
    require => User['jenkins']
}

git::config { 'user.email':
  value => 'jenkins@jenkins.com',
  user  => 'jenkins',
  require => User["jenkins"],
}

git::config { 'user.name':
  value => 'jenkins',
  user  => 'jenkins',
  require => User["jenkins"],
}

