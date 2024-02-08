const images_upload_handler = function(blobInfo, success, failure) {
    var xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    //restricted it to image only using resource_type = image in url, you can set it to auto for all types

    xhr.open(
        'POST',
        'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload'
    );

    xhr.onload = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var url = response.secure_url; //get the url
            var json = { location: url }; //set it in the format tinyMCE wants it
            success(json.location);
        }
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    formData.append('upload_preset', '<YourUnsignedUploadPreset>');

    xhr.send(formData);
};

/*
         tinymce.init({
          selector: 'textarea#post',  // change this value according to your HTML
          images_upload_handler: image_upload_handler(),
          height: 500,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste imagetools wordcount'
          ],
          toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        
        });
        */
/*
        tinymce.init({
            selector: 'textarea#post', 
            plugins: [ 
              'link image code',
              'advlist openlink autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste imagetools wordcount'
            ],
            link_assume_external_targets: true,
            toolbar: 'link insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          
          });

          */
/*
tinymce.init({
  selector: 'textarea#post',
  formats: {
    alignleft: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video',
      classes: 'left',
    },
    aligncenter: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video',
      classes: 'center',
    },
    alignright: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video',
      classes: 'right',
    },
    alignjustify: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video',
      classes: 'full',
    },
    bold: { inline: 'span', classes: 'bold' },
    italic: { inline: 'span', classes: 'italic' },
    underline: { inline: 'span', classes: 'underline', exact: true },
    strikethrough: { inline: 'del' },
    forecolor: {
      inline: 'span',
      classes: 'forecolor',
      styles: { color: '%value' },
    },
    hilitecolor: {
      inline: 'span',
      classes: 'hilitecolor',
      styles: { backgroundColor: '%value' },
    },
    custom_format: {
      block: 'h1',
      attributes: { title: 'Header' },
      styles: { color: 'black' },
    },
  },
  height: 300,
  plugins:
    'link image code advlist openlink autolink lists link image charmap print preview anchor',
  menu: {
    file: {
      title: 'File',
      items: 'newdocument restoredraft | preview | print ',
    },
    edit: {
      title: 'Edit',
      items: 'undo redo | cut copy paste | selectall | searchreplace',
    },
    view: {
      title: 'View',
      items:
        'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
    },
    insert: {
      title: 'Insert',
      items:
        'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
    },
    format: {
      title: 'Format',
      items:
        'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
    },
    tools: {
      title: 'Tools',
      items: 'spellchecker spellcheckerlanguage | code wordcount',
    },
    table: {
      title: 'Table',
      items: 'inserttable | cell row column | tableprops deletetable',
    },
    help: { title: 'Help', items: 'help' },
  },
  default_link_target: '_blank',
  relative_urls: true,
  automatic_uploads: true,
  images_upload_url:
    'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
  images_reuse_filename: true,
  document_base_url: '//www.tiny.cloud/docs/demo',
  toolbar:
    'link insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});
*/
/*
tinymce.init({
  selector: 'textarea#post',

  height: 300,
  plugins:
    'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
  menu: {
    file: {
      title: 'File',
      items: 'newdocument restoredraft | preview | print ',
    },
    edit: {
      title: 'Edit',
      items: 'undo redo | cut copy paste | selectall | searchreplace',
    },
    view: {
      title: 'View',
      items:
        'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
    },
    insert: {
      title: 'Insert',
      items:
        'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
    },
    format: {
      title: 'Format',
      items:
        'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
    },
    tools: {
      title: 'Tools',
      items: 'spellchecker spellcheckerlanguage | code wordcount',
    },
    table: {
      title: 'Table',
      items: 'inserttable | cell row column | tableprops deletetable',
    },
    help: { title: 'Help', items: 'help' },
  },
  default_link_target: '_blank',
  relative_urls: true,
  automatic_uploads: true,
  images_upload_url:
    'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
  images_reuse_filename: true,
  document_base_url: '//www.tiny.cloud/docs/demo',
  toolbar:
    'link insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});
 */

tinymce.init({
    selector: 'textarea#post',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});

tinymce.init({
    selector: 'textarea#job',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});

tinymce.init({
    selector: 'textarea#accomodation',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});

tinymce.init({
    selector: 'textarea#product',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});
tinymce.init({
    selector: 'textarea#institution',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});

tinymce.init({
    selector: 'textarea#course',
    width: 600,
    height: 300,
    default_link_target: '_blank',
    automatic_uploads: true,
    images_upload_url: 'https://api.cloudinary.com/v1_1/oakdigitalstudio/image/upload',
    images_reuse_filename: true,
    plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking table emoticons template paste help ',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {
            title: 'My Favorites',
            items: 'code visualaid | searchreplace | emoticons',
        },
    },
    menubar: 'favs file edit view insert format tools table help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});