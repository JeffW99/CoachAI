function checkfile(sender) {
    // accepted file type
    var validExts = new Array(".mp4");
  
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("File tpye is not acceptable,please upload correct file extension：" + validExts.toString());
      sender.value = null;
      return false;
    }
    else return true;
}

function show_file_select() {
    $('.modal').on('show.bs.modal', function (e) {
        var $trigger = $(e.relatedTarget)[0].id;
        $('.modal-body').append('<form id="autoanalysis_form" enctype="multipart/form-data" method="post"></form>')
        $('#autoanalysis_form').append('<select id="video_name" name="Video Name" class="form-control"></select>');
        filename = '/preprocessing/Data/Output/videolist.json';

        $.getJSON(filename, function(data) {
            if($trigger == "tracknet_btn") {
                data = data.previous_tracknet;
            }
            if($trigger == "segmentation_btn") {
                data = data.previous_segmentation;
            }
            if($trigger == "predict_ball_type_btn") {
                data = data.previous_predict_balltype;
            }
            if($trigger == "one_click_to_complete_btn") {
                data = data.previous_tracknet;
            }
            console.log(data)

           for(var index = 0;index < data.length;index++) {
              var insertText = '<option value=' + data[index] + '>' + data[index] + '</option>';
              $('#video_name').append(insertText); 
          }
        });
        
        $('#autoanalysis_form').append('<button type="submit" id="model_name" class="btn btn-primary" name=' + $trigger + '>Confirm</button>');
     
        $('#autoanalysis_form').submit(function(e) {
            var formData = new FormData();
            //new===============================================================
            if(document.getElementById('model_name').name == 'tracknet_btn'){
                formData.append('uploadvideomode', 'off');
                formData.append('tracknetpredictmode', 'on');
                formData.append('segmentationmode', 'off');
                formData.append('predictballtpyemode', 'off');
            }
            if(document.getElementById('model_name').name == 'segmentation_btn'){
                console.log(document.getElementById('model_name').name)
                formData.append('uploadvideomode', 'off');
                formData.append('tracknetpredictmode', 'off');
                formData.append('segmentationmode', 'on');
                formData.append('predictballtpyemode', 'off');
            }
            if(document.getElementById('model_name').name == 'predict_ball_type_btn'){
                formData.append('uploadvideomode', 'off');
                formData.append('tracknetpredictmode', 'off');
                formData.append('segmentationmode', 'off');
                formData.append('predictballtpyemode', 'on');
            }
            if(document.getElementById('model_name').name == 'one_click_to_complete_btn'){
                formData.append('uploadvideomode', 'on');
                formData.append('tracknetpredictmode', 'on');
                formData.append('segmentationmode', 'on');
                formData.append('predictballtpyemode', 'on');
            }
            //==================================================================

            var dataFile = document.getElementById('video_name').value;
            formData.append('videoname', dataFile);
        
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            // $('.file-size').html('File size : ' + parseInt(formData.get('video_uploader')['size']/1024) + 'KB');
            
            $.ajax({
                type: "POST",
                url: '/cgi-bin/auto_main.py',        // "POST /autoanalysis.html HTTP/1.1" 501
                contentType: false,
                cache: false,
                processData: false,
                
                success: function(response)
                {
                    // console.log(response)
                },
                error: function(jqXHR, exception) {
                    alert("ERROR : ");
                    alert(window.location.href);
                    // var err = eval("(" + xhr.responseText + ")");
                    // alert(err.Message);
                }
            }).done(function(data) {
                alert("DONE : ");
                alert(window.location.href);
                $('#file_select').hide(function(event){     //not enter
                    alert("CLOSE : ");
                    alert(window.location.href);
                    $(".modal-body form").remove();
                });
                console.log(data)
                // $('.module-btn').append(data);
            });
        
        });
    });                        　                 
}

$(function () {
    $('#submit-video').submit(function(e) {
        // avoid empty file upload
        if(document.getElementById('video-uploader').value.length == 0){
            alert("Please upload file.");
            return false;
        }
        e.preventDefault(); // avoid to execute the actual submit of the form.
    
        var formData_upload = new FormData();
        formData_upload.append('uploadvideomode', 'on');
        formData_upload.append('tracknetpredictmode', 'off');
        formData_upload.append('segmentationmode', 'off');
        formData_upload.append('predictballtpyemode', 'off');
        var dataFile = document.getElementById('video-uploader').files[0];
        formData_upload.append('videoname', dataFile);


        for (var key of formData_upload.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
    
        $('.file-size').html('File size : ' + parseInt(formData_upload.get('videoname')['size']/1024) + 'KB');
        
        $.ajax({
            type: "POST",
            url: '/cgi-bin/auto_main.py',
            data: formData_upload, 
            contentType: false,
            cache: false,
            processData: false,
            xhr: function() {
                console.log(window.location.href);
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',updateProgress, false);
                    myXhr.upload.addEventListener("load", updateComplete);
                }
                return myXhr;
            },
            success: function(response)
            {
                // console.log(response)
            },
            error: function(error) {
                console.log('Error: ' + error);
            }
        }).done(function(data) {
            console.log(data)
            $('.file-size').append(data);
        });
    });

    $('.close').click(function() {
        $('#file_select').hide(function(event){
            $(".modal-body form").remove();
            // $(".modal-body select").remove();
            // $(".modal-body button").remove();
        });
    });

    function updateProgress(e){
        // console.log("total size",e.total)
        // console.log("current upload size",e.loaded)
        if(e.lengthComputable){
            var max = e.total;
            var current = e.loaded;
            var Percentage = parseInt((current * 100)/max);
            $('.progress-bar').css('width', Percentage + '%');
            $('.progress-bar').html(Percentage + '%');
        } 
        else{
            console.log("Unable to compute progress information since the total size is unknown")
        } 
     }

    function updateComplete(e) {
        $('.progress-bar').addClass("progress-bar-success");
        $('.upload-finish').html('Upload finished.Start analysizing, please wait.')
    }
});