<template>
  <div>
    <input type="file" ref="el_file" @change="on_load_file">
    
    搜索列: 
    <select v-model="search_column_index">
      <option v-for="item in column_options" :value="item.index">{{ item.column_name }}</option>
    </select>

    输出列：
    <select v-model="output_column_index">
      <option v-for="item in column_options" :value="item.index">{{ item.column_name }}</option>
    </select>
  </div>

  <div class="row">
    <input type="text" v-model="keyword" placeholder="输入关键字搜索">
  </div>

  <div v-if="data_rows_filter.length > 0" class="row" style="display: flex;">
    <div class="box left-box">
      <table class="data">
        <tr>
          <th v-for="(v, i) in data_rows_filter[0]">
            {{ String.fromCharCode(65 + i) || v }}
          </th>
        </tr>
        <tr v-for="row in data_rows_filter" @click="on_click_row(row)">
          <td v-for="cell in row">{{ cell }}</td>
        </tr>
      </table>
    </div>

    <div class="box right-box">
      <div>
        <button @click="selected_rows = []">清除</button>
        <button @click="print_output">打印</button>
      </div>
      <div class="row" id="print-section">
        <table>
          <tr v-for="row in selected_rows">
            <td>{{ row[output_column_index] }}</td>
            <td><input class="ki" type="text" style="width: 50px;">g</td>
          </tr>
        </table>
        <div >
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const column_options = generate_column_options()

const el_file = ref<HTMLInputElement>()
const data_string = ref('')
const keyword = ref('')
const search_column_index = ref(1)
const output_column_index = ref(2)
const selected_rows = ref([] as string[][])

const data_rows = computed(() => {
  return parse_csv(data_string.value)
})

const data_rows_filter = computed(() => {
  return data_rows.value.filter(row => {
    const search_column_value = row[search_column_index.value].toLowerCase()
    const keyword_value = keyword.value.toLowerCase()
    return search_column_value.indexOf(keyword_value) >= 0
  })
})

function generate_column_options () {
  const options = []

  for (let i = 0; i < 10; i++) {
    options.push({
      index: i,
      column_name: String.fromCharCode(65 + i)
    })
  }

  return options
}

function parse_csv (csv_str: string) {
  return csv_str.split('\n').filter(row => row).map(row => {
    return row.split(',').map(cell => cell.trim())
  })
}

function on_load_file () {
  const el_file_v = el_file.value
  if (el_file_v && el_file_v.files) {
    const file = el_file_v.files[0]

    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)

      reader.onload = e => {
        data_string.value = e.target?.result?.toString() || ''
      }
    }
  }
}

function on_click_row (row: string[]) {
  selected_rows.value.push(row)
}

function print_output () {
  window.print()
}
</script>

<style scoped>
table.data {
  border-collapse: collapse; /* This property prevents double borders between cells */
  border: 1px solid black;   /* Adding a 1px solid black border to the table */
}
table.data th, table.data td {
  border: 1px solid black;   /* Adding a 1px solid black border to table header and data cells */
  padding: 4px;              /* Adding some padding to cells for better spacing */
}
table.data tr {
  cursor: pointer;
}
table.data tr:hover {
  background: #ffdede;
}
.row {
  margin-top: 8px;
}
.box {
  margin-right: 24px;
}
input.ki {
  border: 0;
  text-align: right;
}
</style>

<style>
@media print {
  body {
    visibility: hidden;
  }
  #print-section {
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>