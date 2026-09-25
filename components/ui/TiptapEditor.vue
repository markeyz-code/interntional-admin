<template>
  <div class="tiptap-editor-container border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white">
    <div v-if="editor" class="editor-toolbar flex items-center flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
      <button 
        @click="editor.chain().focus().toggleBold().run()"
        :class="['toolbar-btn font-serif font-bold', { 'is-active bg-gray-200 text-gray-900': editor.isActive('bold') }]"
        title="Bold"
      >
        B
      </button>
      <button 
        @click="editor.chain().focus().toggleItalic().run()"
        :class="['toolbar-btn font-serif italic', { 'is-active bg-gray-200 text-gray-900': editor.isActive('italic') }]"
        title="Italic"
      >
        I
      </button>
      <button 
        @click="editor.chain().focus().toggleStrike().run()"
        :class="['toolbar-btn font-serif line-through', { 'is-active bg-gray-200 text-gray-900': editor.isActive('strike') }]"
        title="Strike"
      >
        S
      </button>
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="['toolbar-btn font-medium', { 'is-active bg-gray-200 text-gray-900': editor.isActive('heading', { level: 1 }) }]"
        title="Heading 1"
      >
        H1
      </button>
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="['toolbar-btn font-medium', { 'is-active bg-gray-200 text-gray-900': editor.isActive('heading', { level: 2 }) }]"
        title="Heading 2"
      >
        H2
      </button>
      
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      
      <button 
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="['toolbar-btn', { 'is-active bg-gray-200 text-gray-900': editor.isActive('bulletList') }]"
        title="Bullet List"
      >
        <List class="w-4 h-4" />
      </button>
      <button 
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="['toolbar-btn', { 'is-active bg-gray-200 text-gray-900': editor.isActive('orderedList') }]"
        title="Ordered List"
      >
        <ListOrdered class="w-4 h-4" />
      </button>
      <button 
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="['toolbar-btn', { 'is-active bg-gray-200 text-gray-900': editor.isActive('blockquote') }]"
        title="Blockquote"
      >
        <Quote class="w-4 h-4" />
      </button>
      
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      
      <button 
        @click="setLink"
        :class="['toolbar-btn', { 'is-active bg-gray-200 text-gray-900': editor.isActive('link') }]"
        title="Insert Link"
      >
        <LinkIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click="addImage"
        class="toolbar-btn"
        title="Insert Image"
      >
        <ImageIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="['toolbar-btn', { 'is-active bg-gray-200 text-gray-900': editor.isActive('codeBlock') }]"
        title="Code Block"
      >
        <Code class="w-4 h-4" />
      </button>

      <div class="flex-1"></div>

      <button 
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="toolbar-btn disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo class="w-4 h-4" />
      </button>
      <button 
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="toolbar-btn disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo class="w-4 h-4" />
      </button>
    </div>
    
    <editor-content :editor="editor" class="flex-1 overflow-y-auto p-4 tiptap-content prose max-w-none focus:outline-none min-h-[300px]" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import { 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = ref<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder || 'Start typing...',
        emptyEditorClass: 'is-editor-empty'
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand underline cursor-pointer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-sm max-w-full my-4'
        }
      }),
      Dropcursor.configure({
        color: '#006B5E', // Brand color
        width: 3,
        class: 'dropcursor'
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML())
    }
  })
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (isSame) {
    return
  }
  editor.value?.commands.setContent(value, false)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // update link
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('Image URL')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<style>
.toolbar-btn {
  @apply p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all min-w-[28px] h-7 flex items-center justify-center;
}
.tiptap-content .is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
.tiptap-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
.ProseMirror p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.ProseMirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.ProseMirror blockquote {
  border-left: 3px solid #e2e8f0;
  padding-left: 1rem;
  font-style: italic;
  color: #64748b;
  margin: 1rem 0;
}
.ProseMirror code {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
}
.ProseMirror pre {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: monospace;
  margin: 1rem 0;
}
</style>
