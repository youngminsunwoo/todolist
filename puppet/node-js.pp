#install node js

class { '::nodejs':
  repo_url_suffix => 'node_4.x',
} ->
file { '/usr/bin/node':
  ensure => 'link',
  target => '/usr/bin/nodejs',
  mode   => '0755',
}

package { 'grunt-cli':
  ensure   => '1.2.0',
  provider => 'npm',
  require  => File['/usr/bin/node']
}

package { 'http-server':
  ensure   => '0.9.0',
  provider => 'npm',
  require  => File['/usr/bin/node']
}

package { 'phantomjs':
  ensure   =>  '2.1.1',
  provider => 'npm',
  require  =>  File['/usr/bin/node']
} ->

file { ['/etc/profile.d/phantomjs.sh','/var/lib/jenkins/.profile']:
  ensure  =>  present
  content =>  inline_template('export PHANTOMJS_BIN="/usr/bin/phantomjs"'),
}
