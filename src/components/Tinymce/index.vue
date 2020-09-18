<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <label>
      <textarea :id="tinymceId" class="tinymce-textarea" />
    </label>
    <!--    <div class="editor-custom-btn-container">-->
    <!--      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />-->
    <!--      <el-button :after-read="uploadImage" multiple>-->
    <!--        <el-button icon="plus" type="primary">上传图片</el-button>-->
    <!--      </el-button>-->
    <!--    </div>-->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
// import powerpaste from '../../assets/powerpaste/plugin.min'
import { imageUpload } from '@/api/article'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  // components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      // default: 'file edit insert view format table '
      default: 'file edit insert view format table tools'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
      // postData:[]
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce: function() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        // language: this.languageTypeList['en'],
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false, // 禁用图像/表格的所有大小调整
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true, // 如果在空的内部块元素中按下Enter键，则可以使用此选项拆分当前容器块元素。
        external_plugins: { // 额外的插件
          // 'powerpaste': 'https://cdn.o0o.xyz/powerpaste/plugin.min.js'
          // 'powerpaste': 'https://logansoft-1251079091.cos.ap-guangzhou.myqcloud.com/powerpaste/plugin.min.js'//腾讯云太难用 CDN也不好用
          // 'powerpaste': 'https://logansoft.oss-cn-shenzhen.aliyuncs.com/powerpaste/plugin.min.js'
          'powerpaste': 'https://cdn.o0o.xyz/powerpaste/plugin.min.js'
        },
        // powerpaste_word_import: 'clean',
        powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear
        powerpaste_html_import: 'merge', // propmt, merge, clear
        powerpaste_allow_local_images: true, // 允许带图片

        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        paste_data_images: true,
        default_link_target: '_blank',
        link_title: false,
        statusbar: false,
        /**
         * 设定图片 title
         */
        image_title: true,
        /**
         * 图像高级选项卡 可以定义边框
         */
        image_advtab: true,
        /**
         * 是否禁止拖拽图片上传
         * */
        block_unsupported_drop: false,
        /**
         * 自定义文件筛选 支持三种类型 'file image media'
         */
        file_picker_types: 'image', //
        /**
         * 自定义的文件上传
         */
        file_picker_callback: function(callback, value, meta) {
          console.log('file_picker_callback')
          /**
           * 创建一个input标签 模拟表单提交
           * 通过 window.tinymce.activeEditor.editorUpload.blobCache 拿到图片 blob
           *
           */
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.onchange = function() {
            var file = this.files[0]
            var reader = new FileReader()
            reader.onload = function() {
              var id = 'BlobId' + (new Date()).getTime()
              var blobCache = window.tinymce.activeEditor.editorUpload.blobCache
              var base64 = reader.result.split(',')[1]
              var blobInfo = blobCache.create(id, file, base64)
              blobCache.add(blobInfo)

              const formData = new FormData()
              formData.append('file', blobInfo.blob(), blobInfo.filename())
              // fd.append('file', field.file)
              const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
              }
              imageUpload(formData)
                .then(response => {
                  window.tinymce.get(_this.tinymceId).insertContent(`<img  src="${response.data.url}"  alt=""/>`)
                }).catch((err) => {
                  console.log(err)
                })
              // _this.axios.post('/user/upload', formData, config)
              //   .then(response => {
              //     window.tinymce.get(_this.tinymceId).insertContent(`<img  src="${response.data.url}" />`)
              //   }).catch((err) => {
              //     console.log(err)
              //   })

              /** *
               * 回调,并使用文件名填充Title字段
               */
              callback(blobInfo.blobUri(), { title: file.name })
            }
            reader.readAsDataURL(file)
          }

          input.click()

          // Provide file and text for the link dialog
          // if (meta.filetype === 'file') {
          //   callback('mypage.html', { text: 'My text' })
          // }

          // Provide image and alt text for the image dialog
          // if (meta.filetype === 'image') {
          //   callback('myimage.jpg', { alt: 'My alt text' })
          // }

          // Provide alternative source and posted for the media dialog
          // if (meta.filetype === 'media') {
          //   callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' })
          // }
        },
        images_upload_url: '/user/upload',
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0)
          const formData = new FormData()
          var id = new Date().getTime()
          console.log(blobInfo)
          console.log(blobInfo.name())
          console.log(blobInfo.filename())
          formData.append('file', blobInfo.blob(), id + '_' + blobInfo.filename())
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          imageUpload(formData)
            .then(response => {
              success(response.data.url)
              progress(100)
            }).catch((err) => {
              console.log(err)
            })
          // _this.axios.post('/user/upload', formData, config)
          //   .then(response => {
          //     success(response.data.url)
          //     progress(100)
          //     // _this.imageSuccessCBK([response.data.url])
          //     // window.tinymce.get(_this.tinymceId).insertContent(`<img  src="${response.data.url}" />`)
          //   }).catch((err) => {
          //     console.log(err)
          //   })
          // upload(formData).then(() => {
          //   success(url);
          //   progress(100);
          // })
        },
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
      })
    },

    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    /** *
     * 上传图片
     * @param field
     */
    uploadImage(field) {
      console.log('uploadImage')
      const _this = this
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const fd = new FormData()
      fd.append('file', field.file)

      this.axios.post('/mock/user/upload', fd, config)
        .then(response => {
          console.log(response.data.url)
          console.log(_this)
          window.tinymce.get(_this.tinymceId).insertContent(`<img  src="${response.data.url}" alt="" />`)
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  // 上传文件到oss
  // callbackOss(fileObj, filePath, callbackImg) {
  //   const formData = new FormData()
  //   formData.append('key', filePath)
  //   formData.append('policy', policy)
  //   formData.append('OSSAccessKeyId', accessKeyId)
  //   formData.append('success_action_status', '200') // 让服务端返回200,不然，默认会返回204
  //   formData.append('callback', callback)
  //   formData.append('signature', signature)
  //   formData.append('file', fileObj)
  //
  //   const config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   }
  //   this.axios.post(host, formData, config)
  //     .then(function(result) {
  //       uploadOss.imgPath = host + '/' + result.data.data.filename
  //       if (callbackImg) {
  //         callbackImg()
  //       }
  //     })
  // },
  imageSuccessCBK(arr) {
    console.log(arr)
    arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img src="${v.url}"  alt=""/>`))
  }

}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
