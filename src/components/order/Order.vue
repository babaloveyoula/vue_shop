<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="10">
               <el-col :span="8">
                   <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search" ></el-button>
                </el-input>
               </el-col>
           </el-row>

           <el-table border stripe 
               :data="orderList">
               <el-table-column
                  type="index"
                   label="#" >
               </el-table-column>
               <el-table-column
                   prop="order_number"
                   label="订单编号"
                   width="width">
               </el-table-column>
               <el-table-column
                   prop="order_price"
                   label="订单价格" >
               </el-table-column>
                <el-table-column
                   prop="pay_status"
                   label="是否付款" >
                   <template slot-scope="scope">
                      <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
                      <el-tag type="success" v-else>已付款</el-tag>
                   </template>
               </el-table-column>
                <el-table-column
                   prop="is_send"
                   label="是否发货" >
               </el-table-column>
                <el-table-column
                   prop="create_time"
                   label="下单时间" >
                   <template slot-scope="scope">
                       {{scope.row.create_time | dateFormat}}
                   </template>
               </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                       <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
               </el-table-column>
           </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
        title="修改地址"
        :visible.sync="adressVisible"
        @close="addressDialogClosed"
        width="50%">
       <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
                    :options="cityData"
                    v-model="addressForm.address1"
                   >
                </el-cascader>
            </el-form-item>
             <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="adressVisible = false">取 消</el-button>
            <el-button type="primary" @click="adressVisible = false">确 定</el-button>
        </span>
        </el-dialog>
<!-- 展示物流进度对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressDialogVisible"
            width="50%">
            <el-timeline >
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
           
        </el-dialog>
    </div>
</template>

<script>
import cityData from "./citydata"
    export default {
        data(){
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                total:0,
                orderList:[],
                adressVisible:false,
                addressForm:{
                    address1:[],
                    address2:''
                },
                addressFormRules:{
                    address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' },],
                      address2:[{ required: true, message: '请填写详细地址', trigger: 'blur' }]
                },
                cityData,
                progressDialogVisible:false,
                progressInfo:[]
            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
          async  getOrderList(){
             const {data:res}=await   this.$http.get(`orders`,{params:this.queryInfo})
             if(res.meta.status !==200){
                 return this.$message.error("获取订单列表失败")
             }
             this.total=res.data.total
             
             this.orderList=res.data.goods
            },
            handleSizeChange(newsize){
                this.queryInfo.pagesize=newsize
                this.getOrderList()
            },
            handleCurrentChange(newpage){
                console.log(newpage)
                this.queryInfo.pagenum=newpage
                this.getOrderList()
            },
            // 展示修改地址的对话框
            showBox(){
                this.adressVisible=true
            },
            addressDialogClosed(){
                this.$refs.addressFormRef.resetFields()
            },
           async showProgressBox(){
                this.progressDialogVisible=true
             const {data:res}=await   this.$http.get(`/kuaidi/804909574412544580`)
             if(res.meta.status !== 200) return this.$message.error("获取物流进度失败")
             this.progressInfo=res.data
             console.log(this.progressInfo)
            }
        },
    }
</script>

<style lang="less" scoped>
.el-cascader{
    width:100%;
}
</style>