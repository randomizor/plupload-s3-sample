class ImagesController < ApplicationController
  
  def get_policy
    
    render :json => {:policy => policy, :signature => signature, bucket: Settings.s3.bucket, key: Settings.s3.access_key_id}.to_json
    
  end
  
  private
  
  def policy
    conditions = [
  	  { "bucket" => Settings.s3.bucket },
      { "acl" => 'public-read' },
      ["starts-with", "$utf8", ""],
  	  ['starts-with', '$key', ''],
  	  ['starts-with', '$name', ''],
  	  ["starts-with", "$success_action_status", ""],
  	  ['starts-with', '$Filename', '']
    ]

    policy = {
      # Valid for 3 hours. Change according to your needs
      'expiration' => (Time.now.utc + 3600 * 3).iso8601,
      'conditions' => conditions
    }

    Base64.encode64(JSON.dump(policy)).gsub("\n","")
  end

  def signature
    Base64.encode64(
      OpenSSL::HMAC.digest(
        OpenSSL::Digest::Digest.new('sha1'),
        Settings.s3.secret_access_key, policy
      )
    ).gsub("\n","")
  end
  
end
