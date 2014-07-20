PluploadS3::Application.routes.draw do

  get "images/upload"
  root 'images#upload'
  
  namespace :images do
    get 'get_policy'
  end

end
