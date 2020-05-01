<template>
    <div>
         <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
           <el-row :gutter="10">
               <el-col :span="8">
                   <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                </el-input>
               </el-col>
               <el-col :span="4">
                   <el-button type="primary" @click="goAddPage">添加商品</el-button>
               </el-col>
           </el-row>
           <el-table stripe border :data="goodsList"  >
               <el-table-column   label="#"  type="index"   width="width"></el-table-column>
               <el-table-column prop="goods_name"  label="商品名称" ></el-table-column>
               <el-table-column prop="goods_price"  label="商品价格(元)" width="95px"  ></el-table-column>
               <el-table-column prop="goods_weight"  label="商品重量" width="70px"></el-table-column>
               <el-table-column prop="add_time"  label="创建时间" widhh="140px">
                   <template slot-scope="scope">
                     {{scope.row.add_time | dateFormat}}
                   </template>
               </el-table-column>
               <el-table-column  label="操作" width="130px">
                   <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.goods_id)"></el-button>
                   </template>
               </el-table-column>
           </el-table>

           <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </el-card>
    </div>
</template>

<script>
    export default {
        created() {
            this.getGoodsList()

            
        },
        data(){
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                total:0,
                goodsList:[]
            }
        },
        methods: {
          async  getGoodsList(){
            const {data:res}=await    this.$http.get(`goods`,{
                    params:this.queryInfo
                })
                if(res.meta.status !==200) {
                    return this.$message.error("获取商品列表失败")
                }
                // this.$message.success(res.meta.msg)
                // console.log(res.data)
                this.goodsList=res.data.goods
                this.total=res.data.total
            }, handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage
            this.getGoodsList()
        },
         editUser(){

        },
       async deleteUser(id){
         const confirmResult=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch(err=>err)
                        console.log(confirmResult)
            if(confirmResult!=="confirm") {
                return this.$message.info("已取消了删除")
            }
           const {data:res}=await this.$http.delete(`goods/${id}`)
           if(res.meta.status !== 200) return this.$message.error("删除失败")
           this.$message.success("删除成功")
           this.getGoodsList()
        },

        goAddPage(){
            this.$router.push("/goods/add")
        }



        }
       
       
    }
</script>

<style lang="less" scoped>

</style>