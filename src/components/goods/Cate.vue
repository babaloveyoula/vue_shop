<template>
    <div>
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="6">
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table :data="cateList" :columns="columns" 
            show-index border
            :selection-type="false" :expand-type="false">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
                    <i class="el-icon-erroe" v-else style="color:red"></i>
                </template>

                <template slot="order" slot-scope="scope">
                   <el-tag size="mini" v-if="scope.row.cat_level===0" >一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1" >二级</el-tag>
                     <el-tag type="warning" size="mini" v-else >三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                   <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                   <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                :page-sizes="[3, 5, 10, 15]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>


            
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                @close="addCateDialogClosed"
                width="50%">
                 <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px" >
                    <el-form-item label="分类名称" prop="cat_name" width="140px">
                        <el-input  v-model="addCateForm.cat_name" ></el-input>
                    </el-form-item>
                     <el-form-item label="父级分类" width="140px">
                        <el-cascader v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascadeProps"
                        @change="parentCateChange" clearable=""></el-cascader>

                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                cateList:[],
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                total:0,
                columns:[
                    {label:"分类名称",prop:"cat_name"},
                    {label:"是否有效",type:"template",template:'isok'},
                    {label:"排序",type:"template",template:'order'},
                     {label:"操作",type:"template",template:'opt'}
                    ],
                addCateDialogVisible:false,
                addCateForm:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0
                },
                parentCateList:[],
                cascadeProps:{
                    expandTrigger: 'hover',
                    label:'cat_name',
                    children:"children",
                    value:'cat_id',
                    checkStrictly:true
                },
                selectedKeys:[],
                // 表单验证规则
                addCateFormRules:{
                    cat_name:[
                        {required:true,message:"请输入分类名称",trigger:"blur"}
                    ]
                }
            }
        },
        created(){
            this.getCateList()
        },
        methods:{
          async  getCateList(){
           const {data:res}= await  this.$http.get("categories",{params:this.queryInfo})
           if(res.meta.status !==200){
               return this.$message.error(res.meta.msg)
           }
           console.log(res)
           this.cateList=res.data.result
           this.total=res.data.total
            },
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible=true
                
            },
            // 获取父类列表
          async  getParentCateList(){
             const {data:res}=await   this.$http.get("categories",{params:{type:2}})
             if(res.meta.status !==200){
                 this.$message.error("获取父级分类数据失败")
             }
             this.parentCateList=res.data
            },
            parentCateChange(){
               if(this.selectedKeys.length>0){
                  this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
                  this.addCateForm.cat_level=this.selectedKeys.length
                  return 
               }else{
                    this.addCateForm.cat_pid= 0
                  this.addCateForm.cat_level=0
               }
            },
            addCate(){
                this.$refs.addCateFormRef.validate( async valid=>{
                    if(!valid) return 
                 const {data:res}=await   this.$http.post("categories",this.addCateForm)
                 if(res.meta.status !== 201) this.$message.error("添加分类失败")
                 this.$message.success("添加分类成功")
                 this.getCateList()
                 this.addCateDialogVisible=false
                })
            },
            addCateDialogClosed(){
                
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys=[]
                this.addCateForm.cat_level=0
                this.addCateForm.cat_pid=0
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize
                this.getCateList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage
                this.getCateList()
            }
        }
    }
</script>

<style scoped>
.el-row{
    margin-bottom: 15px;
}
.el-cascader {
    width:100%
}
</style>