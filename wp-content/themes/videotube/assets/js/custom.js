(function($) {
    "use strict";

    function setPlaytListlHeight(){
        $( '#liked-list .widget-content' ).height( $( '.player-container' ).height() );
        $( '#liked-list' ).removeClass( 'd-none' );            
    }

    setPlaytListlHeight();

    $( window ).resize( setPlaytListlHeight );

    function scrollIntoCurrentListView(){
        var list = $( '#liked-list .widget-content .current' );

        if( list.length != 0 ){
            list[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }       
    }

    scrollIntoCurrentListView();

    try{
        autosize($('.autosize'));
    } catch (e) {
        console.log(e.message)
    }

    try {

        if( $( '#mars-submit-video-form #wp-post_content-wrap' ).length != 0 ){
            $( '#mars-submit-video-form' ).mousedown(function() {
                tinyMCE.triggerSave();
            });
        }
    } catch (e) {
        // TODO: handle exception
    }

    /**
     *
     * Readmore JS
     * 
     */
    try {
        if ($('.content-more-js').length != 0) {
            var $settings = $.parseJSON($('.content-more-js').attr('data-settings'));
            $('.content-more-js').readmore($settings);
        }
    } catch (e) {
        console.log(e.message)
    }

    try {
        $('.carousel').each(function( k, v ){
            var json = $.parseJSON( $(this).attr( 'data-setup' ) );
            $(this).carousel( $.extend({}, json, {
                touch : true
            }) );
        });
    } catch (e) {
        // TODO: handle exception
    }

	try {

        $('#main-menu .dropdown-menu a.dropdown-toggle').on('click', function(e) {
          if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
          }
          var $subMenu = $(this).next(".dropdown-menu");
          $subMenu.toggleClass('show');

          $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
            $('.dropdown-submenu .show').removeClass("show");
          });

          return false;
        }); 

	    $('input[type="submit"]').addClass('btn btn-primary btn-sm px-3');

		$('input:not(.form-control, [type=submit], [type=checkbox]),select:not(.form-control), textarea:not(.form-control)').addClass('form-control form-control-sm');

	} catch (e) {
	    // TODO: handle exception
	}

    try{
        $( document ).on( 'mouseover', '.mars-featuredvideo-widgets .video.type-video', function(e){
            $(this).find( '.img-hover' ).addClass( 'active' );
        } );
        $( document ).on( 'mouseout', '.mars-featuredvideo-widgets .video.type-video', function(e){
            $(this).find( '.img-hover' ).removeClass( 'active' );
        } );
    }catch(e){

    }

    var $submit_form = $( '#mars-submit-video-form' );

    $submit_form.find( '#tab-video-types a:first' ).tab('show');

    $submit_form.find( 'input[name=video_type]' ).val( $submit_form.find( '#tab-video-types a:first' ).attr( 'data-href' ) );

    $submit_form.find( '#tab-video-types a[data-toggle="tab"]' ).on('shown.bs.tab', function (e) {
        $(this).closest( 'form' ).find( 'input[name=video_type]' ).val( e.target.getAttribute( 'data-href' ) );
    });

    if( $submit_form.find( 'input[name=video_type]' ).val() == '' ){
        $submit_form.find( 'input[name=video_type]' ).val( $submit_form.find( '#tab-video-types li.active>a' ).attr( 'data-href' ) );
    }

    $(".switch-button").click(function() {
        $('html, body').animate({
            scrollTop: $("#navigation-wrapper").offset().top
        }, 1000);

        $("#lightoff").fadeToggle();
    });

    $('#lightoff').click(function() {
        $('#lightoff').hide();
    });
    $('.social-share-buttons').css('display', 'none');
    $('a.share-button').on("click", function() {
        var id = $(this).attr('id');
        if (id == 'off') {
            $('.social-share-buttons').slideDown(200);
            $(this).attr('id', 'on');
        } else {
            $('.social-share-buttons').slideUp(200);
            $(this).attr('id', 'off');
        }
    });
    $('table#wp-calendar').addClass('table');
    $('form#vt_loginform > p > input.input').addClass('form-control');

    $(".comments-scrolling").click(function() {
        $('html, body').animate({
            scrollTop: $("div.comments").offset().top
        }, 1000);
    });

    $( '#commentform' ).submit(function(e){
        e.preventDefault();

        var me = $(this);
        var comment_field = me.find( 'textarea#comment' );
        var button = me.find( 'input[button=submit]' );

        var formdata = new FormData( me[0] );

        formdata.append( 'action', 'vt_ajax_comment' );
        formdata.append( '_ajax_nonce', jsvar._ajax_nonce );

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = $.parseJSON( xhr.responseText );

                var notice_class = response.success == true ? 'success' : 'danger';

                if( response.success == true ){
                    var comment = response.data.comment;

                    if( parseInt( comment.comment_parent ) > 0 ){
                        if( $( 'li#comment-' + comment.comment_parent + '> ul.children' ).length > 0 ){
                            $( 'li#comment-' + comment.comment_parent + '> ul.children' ).append( response.data.output );
                        }
                        else{
                            $( 'li#comment-' + comment.comment_parent ).append( '<ul class="children">'+response.data.output+'</ul>' );
                        }
                    }
                    else{
                        $( 'ul#comment-list' ).prepend( response.data.output );
                    }

                    comment_field.val('');

                    me.closest( '.comments' ).find( '.section-header .comment-count' ).html( response.data.comment_count );
                }

                me.find( '.form-submit' ).append( '<p class="text-notice text-'+notice_class+' d-inline-block p-0 m-0">'+response.data.msg+'</p>' );
            }

            me.removeClass( 'waiting' );

            me.find( '.spinner' ).remove();

            button.removeClass( 'disabled' ).removeAttr( 'disabled', 'disabled' );
        }

        xhr.open( 'POST', jsvar.ajaxurl, true );

        xhr.upload.onprogress = function(e){

            me.addClass( 'waiting' );

             me.find( '.text-notice' ).remove();
            me.find( '.form-submit' ).append( '<span class="spinner"></span>' );

            button.addClass( 'disabled' ).attr( 'disabled', 'disabled' );
        }

        xhr.send(formdata);        

    });


    /**
     *
     * AJAX load comments
     * 
     */
    function loadComments( me ){

        if( me.hasClass( 'disabled' ) ){
            return false;
        }

        var cpage   =   me.attr( 'data-comment-paged' );
        var post_id =   me.attr( 'data-post-id' );

        var formdata = new FormData();

        formdata.append( 'action', 'vt_ajax_load_comments' );
        formdata.append( '_ajax_nonce', jsvar._ajax_nonce );
        formdata.append( 'cpage', cpage );
        formdata.append( 'post_id', post_id );

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = $.parseJSON( xhr.responseText );

                if( response.data.output ){
                    $( '#comment-list' ).append( response.data.output ); 
                    me.removeClass( 'disabled' ).removeAttr( 'disabled', 'disabled' );
                }
                else{
                    me.remove();
                }

                me.attr( 'data-comment-paged', response.data.cpage );

                me.html( me.attr( 'data-text-load' ) );
            }
        }

        xhr.open( 'POST', jsvar.ajaxurl, true );

        xhr.upload.onprogress = function(e){
            me.addClass( 'disabled' ).attr( 'disabled', 'disabled' );
            me.html( me.attr( 'data-text-loading' ) );
        }

        xhr.send(formdata);
    }


    $('.load-comments-infinite').appear();

    $( document ).on( 'appear', '.load-comments-infinite', function( event, $all_appeared_elements ) {
        loadComments( $(this) );
    });

    $( document ).on( 'click', '.load-comments-click', function(e){
        e.preventDefault();

        loadComments( $(this) );
    } );

    $('form#mars-submit-video-form input[name=video_file]').on('change', function(event) {
        var $this = $(this);
        var $form = $this.closest('form');
        var $parent = $this.closest( '.tab-pane' );
        var files = event.target.files || event.dataTransfer.files;
        var $button = $parent.find('a.upload-video-file');

        if (!files['0'] || files['0'] === undefined) {
            return false;
        }

        var extension = files['0']['name'].substr((files['0']['name'].lastIndexOf('.') + 1));

        if (extension == "" || jQuery.inArray(extension.toLowerCase(), jsvar.video_filetypes) == -1) {
            alert(jsvar.error_video_filetype);
            $this.val('');
            return false;
        }

        $form.find( '.percent' ).remove();
        $form.find( 'input[name=attachment_id]' ).val('');

        var xhr = new XMLHttpRequest();

        var formdata = new FormData();

        formdata.append('file', files[0]);
        formdata.append('_ajax_nonce', jsvar._ajax_nonce);
        formdata.append('action', 'do_ajax_upload_video_file');

        xhr.open("POST", jsvar.ajaxurl, true);

        xhr.upload.onprogress = function(e) {
            $button.addClass('disabled').attr('disabled', 'disabled');
            var percentComplete = Math.ceil((e.loaded / e.total) * 100);

            var percentCompleteText = '<span class="percent-text">'+ percentComplete + '%</span>';

            if (percentComplete < 100) {
                if ( $parent.find( '.percent' ).length != 0 ) {
                    $parent.find( '.percent' ).html( '<span class="spinner"></span>' +  percentCompleteText ); 
                } else {
                    $button.after( '<div class="percent"><span class="spinner"></span>' + percentCompleteText + '</div>' );
                }
            } else {
                $parent.find('.percent-text').html( jsvar.uploading );
            }
        },

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = jQuery.parseJSON(xhr.responseText);
                if (response.resp == 'error') {
                    $this.val('');
                    $parent.find( '.percent' ).remove();
                    alert(response.message);
                } else {
                    $form.find('input[name=attachment_id]').val(response.attachment_id);
                    $parent.find( '.percent' ).html('<a class="uploaded-file" href="#">' + response.attachment_name + '</a>');
                }

                $button.removeClass('disabled').removeAttr('disabled'); 
            }
        },

        xhr.send(formdata);

    });

    $('form#mars-submit-video-form input#video_thumbnail').on('change', function(event) {
        var $this = $(this);
        var $form = $this.closest('form');
        var $parent = $this.closest('.form-group');
        var files = event.target.files || event.dataTransfer.files;
        var $button = $form.find('a.upload-image-file');

        if (!files['0'] || files['0'] === undefined) {
            return false;
        }

        var extension = files['0']['name'].substr((files['0']['name'].lastIndexOf('.') + 1));

        if (extension == "" || jQuery.inArray(extension.toLowerCase(), jsvar.image_filetypes) == -1) {
            alert(jsvar.error_image_filetype);
            $this.val('');
            return false;
        }

        var xhr = new XMLHttpRequest();

        var formdata = new FormData();

        formdata.append('file', files[0]);
        formdata.append('_ajax_nonce', jsvar._ajax_nonce);
        formdata.append('action', 'do_ajax_upload_image_file');

        xhr.open("POST", jsvar.ajaxurl, true);

        xhr.upload.onprogress = function(e) {
            $button.addClass('disabled').attr('disabled', 'disabled');

            var percentComplete = Math.ceil((e.loaded / e.total) * 100);

            var percentCompleteText = '<span class="percent-text">'+ percentComplete + '%</span>';

            if ( percentComplete < 100) {
                if ( $parent.find( '.percent' ).length != 0 ) {
                    $parent.find( '.percent' ).html( '<span class="spinner"></span>' +  percentCompleteText ); 
                } else {
                    $button.after( '<div class="percent"><span class="spinner"></span>' + percentCompleteText + '</div>' );
                }
            } else {
                $parent.find('.percent-text').html( jsvar.uploading );
            }
        },

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = jQuery.parseJSON(xhr.responseText);
                if (response.resp == 'error') {   
                    $this.val('');
                    $parent.find( '.percent' ).remove();
                    alert(response.message);
                } else {
                    $form.find('input[name=_thumbnail_id]').val(response.attachment_id);

                    if ($parent.find('.thumbnail-image').length != 0) {
                        $parent.find('.thumbnail-image').remove();
                    }

                    var $img = '';
                    $img += '<div class="thumbnail-image">';
                    $img += '<img src="' + response.attachment_url + '">';
                    $img += '</div>';
                    $parent.append($img);
                }
                $parent.find( '.percent' ).remove();
                $button.removeClass('disabled').removeAttr('disabled');
            }
        },

        xhr.send(formdata);

    });

    $('form#mars-submit-video-form').submit(function() {

        var $this = $(this);
        var $data = $this.serialize();
        var $button = $this.find('button[type=submit]');
        var $group = $this.find('.group-submit');

        $.ajax({
            url: jsvar.ajaxurl,
            method: 'POST',
            data: {
                'data': $data,
                '_ajax_nonce': jsvar._ajax_nonce,
                'action': 'do_ajax_submit_video'
            },
            beforeSend: function() {
                $button.addClass('disabled').attr('disabled', 'disabled');
                $this.find('.alert-danger').remove();
            }
        }).done(function($response) {
            var $response = $.parseJSON($response);
            if ($response.resp == 'error') {
                var $text = '<div class="alert alert-danger" role="alert">' + $response.message + '</div>';
                $group.append($text);
            } else {
                window.location.href = $response.redirect_to;
            }

            $button.removeClass('disabled').removeAttr('disabled');

        });

        return false;

    });

    $('button#delete-video').click(function(e) {
        var $this = $(this);
        var $post_id = $this.attr('data-id');
        var $form = $this.closest('form');
        var $group = $form.find('.group-submit');
        if (confirm(jsvar.delete_video_confirm) === true) {
            $.ajax({
                url: jsvar.ajaxurl,
                method: 'POST',
                data: {
                    'post_id': $post_id,
                    '_ajax_nonce': jsvar._ajax_nonce,
                    'action': 'do_ajax_delete_video'
                },
                beforeSend: function() {
                    $this.addClass('disabled').attr('disabled', 'disabled');
                }
            }).done(function($response) {
                var $response = $.parseJSON($response);
                if ($response.resp == 'error') {
                    $this.removeClass('disabled').removeAttr('disabled');
                    var $text = '<div class="alert alert-danger" role="alert">' + $response.message + '</div>';
                    $group.append($text);
                    return false;
                } else {
                    window.location.href = $response.redirect_to;
                }
            });
        }
        return false;

    });

    $('.likes-dislikes').click(function(e) {
        var $this = $(this);
        var $post_id = $this.attr('data-post-id');
        var $parent;

        $parent = $this.closest('.box-like');

        $.ajax({
            url: jsvar.ajaxurl,
            method: 'POST',
            data: {
                'post_id': $post_id,
                '_ajax_nonce': jsvar._ajax_nonce,
                'action': 'do_ajax_like_video'
            },
            beforeSend: function() {
                $parent.css('opacity', '.5');
            }
        }).done(function($response) {
            var $response = $.parseJSON($response);
            if ($response.resp == 'error') {
                alert($response.message);
            } else {
                $('.like-count-' + $post_id).html($response.count);

                if( $response.action == 'liked' ){
                    $( 'body' ).addClass( 'has-liked' );    
                }
                else{
                    $( 'body' ).removeClass( 'has-liked' );
                }
                
            }
            $parent.css('opacity', '1');
        });

        return false;
    });

    $( document ).on( 'click', '.load-more-posts', function(e){

        e.preventDefault();

        var $me = $(this);
        var $data = $me.attr( 'data-setup' );

         jQuery.ajax({
            type: 'POST',
            data: {
                data: $data,
                nonce : jsvar._ajax_nonce,
                action: 'load_more_posts'
            },
            url: jsvar.ajaxurl,
            beforeSend: function() {
                $me.addClass( 'disabled' ).attr( 'disabled', 'disabled' );
            },
            success: function(data) {
                $me.addClass( 'd-none' ).after( data );
            }
        });

    } );


    $('.infinite-scroll-posts').appear();

    $( document ).on( 'appear', '.infinite-scroll-posts', function( event, $all_appeared_elements ) {
        var $me = $(this);
        var $data = $me.attr( 'data-setup' );

         jQuery.ajax({
            type: 'POST',
            data: {
                data: $data,
                nonce : jsvar._ajax_nonce,
                action: 'load_more_posts'
            },
            url: jsvar.ajaxurl,
            beforeSend: function() {
                $me.addClass( 'disabled' ).attr( 'disabled', 'disabled' );
            },
            success: function(data) {
                $me.replaceWith( data );
            }
        });
    });

    $('.player-sticky').appear();

    $( document ).on('appear', '.player-sticky', function( event, $all_appeared_elements ) {
        $(this).removeClass( 'sticky-on' );
    });

     $( document ).on('disappear', '.player-sticky', function( event, $all_appeared_elements ) {
        $(this).addClass( 'sticky-on' );
    });

})(jQuery);