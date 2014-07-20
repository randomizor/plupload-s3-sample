var attachment = {
    
  config:{
	  policy: null,
		signature: null,
		bucket: null,
		key: null
  },
    
	init: function(){		
		
		// Setup plupload and get S3 policy				
		attachment.getPolicy();
		
	},
	
	initImageUploader: function(){
		
		var uploader = new plupload.Uploader({
			runtimes : 'gears,html5,silverlight,browserplus,flash',
			browse_button : 'pickfiles',
			container : 'container',
			max_file_size : '10mb',
			url : 'https://' + attachment.config.bucket + '.s3.amazonaws.com:443/',
			flash_swf_url : "/assets/plupload.flash.swf",
    	silverlight_xap_url : '/assets/plupload.silverlight.xap',
			multi_selection: false,
			multipart: true,
			multipart_params: {
        'Filename': '${filename}',
        success_action_status: "201",
        utf8: true,
        AWSAccessKeyId: attachment.config.key,
        acl: "public-read", 
        policy: attachment.config.policy,
        signature: attachment.config.signature
			},
			file_data_name: 'file',
			filters : [
				{title : "Image files", extensions : "jpg,gif,png,bmp"}
			]
		});
    
		uploader.bind('Init', function(up, params) {
			up.settings.multipart_params.key = "images/" + attachment.getTimeStamp() +"/" + attachment.getUnique() + "/${filename}";
		});
		
		uploader.init();
		
		uploader.bind('FilesAdded', function(up, files) {
			
			$.each(files, function(i, file) {
				
				var $imageBoxes = $('#filelist').find(".image-box");
								
				if($imageBoxes.length && ($imageBoxes.length + 1)%4 == 0){
					var $last_class = "last-box";
				}
				else{
					var $last_class = "";
				}
				
				$('#filelist').append(
					'<div id="' + file.id + '" class="image-box-holder ' + $last_class + '">' +
					'<div class="image-box loading"></div>' +
				'</div>');
												
			});
			
			up.trigger("DisableBrowse", true);
			$("#pickfiles").addClass("disabled");
			
			up.start();
			
			up.refresh(); // Reposition Flash/Silverlight
		});
		
		uploader.bind('BeforeUpload', function(up, file) {
			$file = $('#' + file.id );
			$file.find("div.image-box").html("<div class='progress'><div class='bar' style='width: 0%;'></div></div>")
		});
		
		uploader.bind('UploadProgress', function(up, file) {
			$file = $('#' + file.id );
			$file.find(".bar").css("width", file.percent + "%");
		});
		
		uploader.bind('Error', function(up, err) {
		  
		  // Show error message and remove file
		  
			$(".alert-error").removeClass("hide");
			$('#' + err.file.id ).remove();
			up.trigger("DisableBrowse", false);
			$("#pickfiles").removeClass("disabled");
			up.refresh(); // Reposition Flash/Silverlight
			
		});
		
		uploader.bind('FileUploaded', function(up, file, info) {
				
				// Hide error if showing
				$(".alert-error").addClass("hide");
				
				// Reset key
				up.settings.multipart_params.key = "images/" + attachment.getTimeStamp() +"/" + attachment.getUnique() + "/${filename}";
								
				var $imageURL = $(info.response).find("Location").text(),
					  $key = $(info.response).find("Key").text(),
						$file = $('#' + file.id );

				$file.find(".image-box").removeClass("loading").html('<img src="' + $imageURL + '" />');
								
		});	
		
	},
		
	getTimeStamp: function(){
		return +new Date;
	},
	
	getUnique: function(){
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
	},
	
	getPolicy: function(){
		
		$.ajax({
			url: '/images/get_policy',
			dataType: "json",
			async: false,
			success: function(response){
				
				attachment.config.policy = response.policy;
				attachment.config.signature = response.signature;
				attachment.config.bucket = response.bucket;
				attachment.config.key = response.key;
				
				attachment.initImageUploader();
				
			}
		})
		
	}

}