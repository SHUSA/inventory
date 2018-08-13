# config/deploy/staging.rb

server "10.212.148.42", user: "rails", roles: %w{app db web}
set :deploy_to, "/var/www/#{fetch :application}"

set :branch, 'deploy-scripts'
