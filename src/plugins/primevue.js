import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Toast from 'primevue/toast'
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import BadgeDirective from 'primevue/badgedirective'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import TabMenu from 'primevue/tabmenu'
import InlineMessage from 'primevue/inlinemessage'
import MultiSelect from 'primevue/multiselect'
import Toolbar from 'primevue/toolbar'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Tag from 'primevue/tag'
import FileUpload from 'primevue/fileupload'
import ProgressBar from 'primevue/progressbar'
import Editor from 'primevue/editor'
import Tree from 'primevue/tree'
import Textarea from 'primevue/textarea'
import CascadeSelect from 'primevue/cascadeselect'
import ConfirmDialog from 'primevue/confirmdialog'
import Chip from 'primevue/chip'

export default {
  install: (app, options) => {
    app
      .use(PrimeVue, options)
      .use(ToastService)
      .use(ConfirmationService)
      .component('Card', Card)
      .component('InputMask', InputMask)
      .component('InputNumber', InputNumber)
      .component('InputText', InputText)
      .component('Menu', Menu)
      .component('Button', Button)
      .component('Dialog', Dialog)
      .component('Dropdown', Dropdown)
      .component('Toast', Toast)
      .component('DataTable', DataTable)
      .component('Column', Column)
      .component('TabMenu', TabMenu)
      .component('InlineMessage', InlineMessage)
      .component('Toolbar', Toolbar)
      .component('MultiSelect', MultiSelect)
      .component('DataView', DataView)
      .component('DataViewLayoutOptions', DataViewLayoutOptions)
      .component('Tag', Tag)
      .component('FileUpload', FileUpload)
      .component('ProgressBar', ProgressBar)
      .component('Editor', Editor)
      .component('Tree', Tree)
      .component('Textarea', Textarea)
      .component('CascadeSelect', CascadeSelect)
      .component('ConfirmDialog', ConfirmDialog)
      .component('Chip', Chip)
      .directive('badge', BadgeDirective)
  }
}
