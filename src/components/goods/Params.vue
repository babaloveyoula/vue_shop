<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon> </el-alert>

             <el-row class="cat_opt">
                <el-col >
                    <span>选择商品分类: </span>
                    <!-- 级联选择框 -->
                    <el-cascader
                        v-model="selectdKeys"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
             </el-row>

             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true"> 添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe  style="width: 100%">
                        <el-table-column   type="expand" >
                            <template slot-scope="scope">
                               <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                               <!-- 输入文本框 -->
                               <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                         <el-table-column   type="index" label="#"></el-table-column>
                         <el-table-column
                            prop="attr_name"
                            label="参数名称"
                            width="width">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)" >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                     <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true"> 添加属性</el-button>
                     <el-table :data="onlyTableData" border stripe expand style="width: 100%">
                        <el-table-column   type="expand" >
                            <template slot-scope="scope">
                               <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                               <!-- 输入文本框 -->
                               <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                         <el-table-column   type="index" label="#"></el-table-column>
                         <el-table-column
                            prop="attr_name"
                            label="属性名称"
                            width="width">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
            :title="'添加'+titelText"
            @close="addDialogClose"
            :visible.sync="addDialogVisible"
            width="50%">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
                    <el-form-item :label="titelText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    <!-- 修改参数对话框 -->
        <el-dialog
            :title="'修改'+titelText"
            @close="editDialogClose"
            :visible.sync="editDialogVisible"
            width="50%">
                <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" >
                    <el-form-item :label="titelText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
       
        
    </div>
</template>

<script>
    export default {
        data(){
            return {
                cateList:[],
                cateProps:{
                    expandTrigger: 'hover',
                    value:"cat_id",
                    chidlren:"children",
                    label:"cat_name"
                },
                selectdKeys:[],
                activeName:"many",
                manyTableData:[],
                onlyTableData:[],
                addDialogVisible:false,
                editDialogVisible:false,
                addForm:{
                    attr_name:''
                },
                editForm:{
                    attr_name:'',
                    attr_id:''
                },
                addFormRules:{
                    attr_name:[
                        {
                            required:true,message:"请输入参数名称",trigger:"blur"
                        }
                    ]
                }

            }
        },
        computed:{
            isBtnDisabled(){
                if(this.selectdKeys.length !==3){
                    return true
                }
                return false
            },
            cateId(){
                if(this.selectdKeys.length===3){
                    return this.selectdKeys[2]
                }
                return null
            },
            titelText(){
                if(this.activeName ==="many"){
                    return "动态参数"
                }
                return "静态属性"
            }
        },
        created(){
            this.getCateList()
        },
        methods:{
          async  getCateList(){
             const {data:res}=await this.$http.get("categories")
             if(res.meta.status !==200){
                 return this.$message.error(res.meta.msg)
             }
             this.cateList=res.data
            },
           handleChange(){
                this.getParamsData()
            },
            // tab点击事件处理函数
            handleTabClick(){
                this.getParamsData()
            },
          async   getParamsData(){
                if(this.selectdKeys.length !==3){
                    this.selectdKeys=[]
                    this.manyTableData=[]
                    this.onlyTableData=[]
                    return 
                }
              const {data:res}=await  this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
              console.log(res)
              if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
              res.data.forEach((item,index)=>{
                  item.attr_vals=item.attr_vals?item.attr_vals.split(','):[]
                  item.inputVisible=false
                  item.inputValue=''
              })
              console.log(res.data)
              if(this.activeName==="many"){
                  this.manyTableData=res.data
              }else{
                  this.onlyTableData=res.data
              }
            },
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            addParams(){
                this.$refs.addFormRef.validate( async valid=>{
                    if(!valid) return 
                 const {data:res}=await   this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    })
                   if(res.meta.status !== 201) return this.$message.error("添加失败")
                   this.$message.success(res.meta.msg)
                   this.addDialogVisible=false
                   this.getParamsData()
                })

            },
            showEditDialog(info){
                this.editDialogVisible=true
                this.editForm.attr_name=info.attr_name
                this.editForm.attr_id=info.attr_id
            },
            editDialogClose(){
                this.$refs.editFormRef.resetFields()
            },
         editParams(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return 
             const {data:res}=await  this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                                                    {attr_name:this.editForm.attr_name, attr_sel:this.activeName})
            
             if(res.meta.status !==200) return this.$message.error(res.meta.msg)
             this.$message.success(res.meta.msg)
             this.getParamsData()
             this.editDialogVisible=false
                })
            },
         async   removeParams(attr_id){
             const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).catch(err=>err)
            if(confirmResult !== "confirm"){
                return this.$message.info("已取消删除")
            }
            const {data:res}=   await  this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !==200) return this.$message.error("删除失败")
            this.$message.success(res.meta.msg)
            this.getParamsData()
            },
         async   handleInputConfirm(row){
                if(row.inputValue.trim().length===0){
                    row.inputValue=""
                    row.inputVisible=false
                    retrun 
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue=''
                row.inputVisible=false
                this.saveAttrValuse(row)
           
                
            },
            showInput(row){
                row.inputVisible=true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
        })
            },
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrValuse(row)
            },
        async    saveAttrValuse(row){
                const {data:res}=await     this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(",")   
                })
                if(res.meta.status !==200){
                    return this.$message.error("修改参数项失败")
                }
                this.$message.success("修改参数项成功")
            }



        }
    }
</script>

<style lang="less" scoped>
.cat_opt{
    margin:15px 0;
}
.el-tag{
    margin:5px
}
.input-new-tag{
    width:120px
}
</style>