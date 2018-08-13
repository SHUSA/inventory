# config valid for current version and patch releases of Capistrano
lock "~> 3.11.0"

set :application, "srl_inventory"
set :repo_url, "git@github.com:SHUSA/#{fetch :application}.git"
set :forward_agent, true
set :port, '22'  
set :migration_role, :app
set :assets_roles, [:web, :app]


#append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads', 'node_modules'
#append :linked_files, 'config/database.yml', 'config/secrets.yml', 'config/servers.yml'

set :keep_releases, 4
#set :passenger_restart_with_touch, true

# Dafault to QA ENV stageless deploy
set :stage, :qa


namespace :deploy do
  desc 'Restart application'
  task :restart do
    invoke 'pm2:restart'
  end

  after :publishing, :restart   
end
