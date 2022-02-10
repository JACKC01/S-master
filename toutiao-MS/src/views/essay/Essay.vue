<template>
  <div class="essay-container">
    <el-card class="box-card">
      <template #header class="clearfix">
        <BreadCrumb
          :second-name="$route.query.articleId ? '编辑文章' : '发布文章'"
        ></BreadCrumb>
      </template>
      <el-form
        ref="publishForm"
        :model="publishForm"
        label-width="60px"
        :rules="publishFormRules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="publishForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" required>
          <el-tiptap
            v-model="publishForm.content"
            :extensions="extensions"
            placeholder="请输入文章内容..."
            :height="350"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="publishForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="publishForm.cover.type > 0">
            <div class="img-cover-container">
              <ImageCover
                v-for="(item, index) in publishForm.cover.type"
                :key="index"
                @upload-image="onUploadImage(index, $event)"
                :img-url="publishForm.cover.images[index]"
              ></ImageCover>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="publishForm.channel_id">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in channelList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            ref="editPublish"
            type="primary"
            @click="$route.query.articleId ? onUpdate() : onPublish()"
            class="publish-btn"
            :loading="isLoading"
            >{{ $route.query.articleId ? '修改' : '发表' }}</el-button
          >
          <el-button
            class="save-btn"
            @click="saveDraft"
            :loading="isSaving"
            v-show="!$route.query.articleId"
            >{{ isSaving ? '存入中...' : '存为草稿' }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { publishFormRules } from 'utils/elementFormRules'
import BreadCrumb from 'components/common/BreadCrumb'
import ImageCover from './essayChild/ImageCover.vue'

import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image
} from 'element-tiptap'
import {
  getArticleChannel,
  addArticle,
  getArticleContent,
  updateArticle
} from 'api/article'
import { uploadImg } from 'api/image'
export default {
  name: 'Essay',
  data () {
    return {
      publishForm: {
        // 标题
        title: '',
        // 内容
        content: '',
        // 封面
        cover: {
          type: 0,
          images: []
        },
        // 频道id
        channel_id: ''
      },

      channelList: [],
      // 是否正在发布文章或修改文章
      isLoading: false,
      // 是否正在存入草稿
      isSaving: false,
      // 富文本编辑器的扩展
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          async uploadRequest (file) {
            const formData = new FormData()
            formData.append('image', file)
            const { data: res } = await uploadImg(formData)
            return res.data.url
          }
        })
      ],
      publishFormRules,
      selectedImgUrl: ''
    }
  },
  components: {
    BreadCrumb,
    ImageCover
  },
  async created () {
    // 加载文章频道列表
    this.loadArticleChannel()
    if (this.$route.query.articleId) {
      const articleId = this.$route.query.articleId
      const { data: res } = await getArticleContent(articleId)
      this.publishForm = res.data
    }
  },
  mounted () {},
  methods: {
    // 加载文章频道
    async loadArticleChannel () {
      const { data: res } = await getArticleChannel()
      this.channelList = res.data.channels
    },
    // 发布文章
    onPublish () {
      this.$refs.publishForm.validate(async value => {
        if (!value) {
          return ''
        } else {
          this.isLoading = true
          this.$refs.editPublish.$el.innerText = '发布中...'
          const { data: res } = await addArticle(this.publishForm)
          if (res.message === 'OK') {
            this.$message.success('文章发布成功')
            this.$router.push('/layout/content')
            console.log(res)
          } else {
            this.$message.warning('发布失败请稍后再试')
          }
          this.isLoading = false
        }
      })
    },
    // 存为草稿
    async saveDraft () {
      this.$refs.publishForm.validate(async value => {
        if (!value) {
          return ''
        } else {
          const { data: res } = await addArticle(this.publishForm, true)
          if (res.message === 'OK') {
            this.$message.success('存入草稿成功')
            this.$router.push('layout/content')
          } else {
            this.$message.warning('存入失败,请稍后再试')
          }
          this.isSaving = false
        }
      })
    },
    // 修改文章
    async onUpdate () {
      this.$refs.publishForm.validate(async value => {
        if (!value) {
          return ''
        } else {
          this.isLoading = true
          this.$refs.editPublish.$el.innerText = '修改中...'
          const articleId = this.$route.query.articleId
          const { data: res } = await updateArticle(articleId, this.publishForm)
          if (res.message === 'OK') {
            this.$message.success('更新成功')
            this.$router.push('/layout/content')
          } else {
            this.$message.warning('更新失败,请稍后再试')
          }
        }
      })
    },
    onUploadImage (index, url) {
      this.publishForm.cover.images[index] = url
    }
  }
}
</script>

<style lang="less">
.essay-container {
  .publish-btn {
    background: linear-gradient(61deg, #00a0fa 0%, #2eb4ff 100%);
    border-radius: 20px;
  }
  .save-btn {
    border-radius: 20px;
  }
  .img-cover-container {
    display: flex;
  }
}
</style>
