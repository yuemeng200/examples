<template>
  <div class="table-container" ref="tableContainer">
    <div class="page-content">
      <div class="table-wrapper" ref="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <template v-for="col in 100">
                <th :key="col">列{{ col }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in 100" :key="row">
              <td class="row-header">{{ row }}</td>
              <template v-for="col in 100">
                <td :key="`${row}-${col}`">{{ mockData[row-1][col-1] }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableView',
  data() {
    return {
      mockData: this.generateMockData()
    }
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('touchmove', (e) => {
        const scroll = document.scrollingElement.scrollTop
        console.log("🚀 ~ window.addEventListener ~ scroll:", scroll)
        e.preventDefault()
      }, {
        capture: true,passive: false
      })
    })
  },
  methods: {
    generateMockData() {
      const data = []
      for (let i = 0; i < 100; i++) {
        const row = []
        for (let j = 0; j < 100; j++) {
          row.push(`数据${i+1}-${j+1}`)
        }
        data.push(row)
      }
      return data
    },

  }
}
</script>

<style>
.table-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.page-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  height: 60px;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

table {
  border-collapse: collapse;
  width: max-content;
  background: white;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 100px;
  height: 40px;
  text-align: center;
}

th {
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
}

th:first-child, td.row-header {
  position: sticky;
  left: 0;
  background: #f5f5f5;
  z-index: 2;
}

th:first-child {
  z-index: 3;
}

tr:hover {
  background-color: #f0f0f0;
}

tr:hover td.row-header {
  background-color: #e8e8e8;
}
</style>