<template>
    <div>
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">  
            <el-row :gutter="15">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table
            border
            stripe
            :data="userList"
            style="width: 100%">
            <el-table-column  type="index" label="#"></el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="角色">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope"> 
                    <el-switch @change="userStateChanged(scope.row)"
                    v-model="scope.row.mg_state">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                   
                    <el-tooltip  effect="dark" content="分配权限" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close="addDialogClosed"
            width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
            </el-form>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
            </el-form>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
               <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
            </span>
        </el-dialog>

    <!-- 编辑对话框 -->
        <el-dialog
            :close-on-click-modal="false"
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
            >
        <el-form ref="editRef" :model="editForm" label-width="80px" :rules="addFormRules">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="edituser">确 定</el-button>
        </span>
        </el-dialog>

        
    </div>
</template>

<script>
    export default {
        data(){
            var checkMail=(rulr,value,cb)=>{
                const regEmail= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(regEmail.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的邮箱"))
            }

            var checkMobile=(rulr,value,cb)=>{
                const regMobile= /^1[34578]\d{9}$/;
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的手机号"))
            }
            return {
                queryInfo:{
                    query:"",
                    pagenum:1,
                    pagesize:2
                },
                userList:[],
                total:0,
                addDialogVisible:false,
                editDialogVisible:false,
                editForm:{},
                addForm:{
                    username:'',
                    password:"",
                    email:'',
                    mobile:""
                },
                addFormRules:{
                    username:[
                       { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                    ],
                     password:[
                       { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
                    ],
                     email:[
                       { required: true, message: '请输入邮箱', trigger: 'blur' },
                       { validator: checkMail, trigger: 'blur' }
                    ],
                    mobile:[
                       { required: true, message: '请输入手机号', trigger: 'blur' },
                       { validator: checkMobile, trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            this.getUserList()
        },
        methods:{
          async  getUserList(){
             const {data:res}=await this.$http.get("users",{params:this.queryInfo})
             if(res.meta.status !== 200) return this.$message.error("获取用户列表失败")
             this.userList=res.data.users
             this.total=res.data.total
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize
                this.getUserList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage
                this.getUserList()
            },
          async  userStateChanged(userinfo){
              const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
              if(res.meta.status !==200) {
                  userinof.mg_state=!userinfo.mg_state
                  return this.$message.error("更新用户状态失败")
                  }
                this.$message.success("更新用户状态成功")
            },
           addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            adduser(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return 
                 const {data:res}=await  this.$http.post("users",this.addForm)
                 if(res.meta.status !==201) {this.$message.error("添加用户失败")}
                 this.$message.success("添加用户成功")
                 this.addDialogVisible=false
                 this.getUserList()
                })
            },
          async  editUser(userinfo){
                
                this.editForm=userinfo
               this.editDialogVisible=true
            },
            editDialogClosed(){
                this.$refs.editRef.resetFields()
            },
            edituser(){
                this.$refs.editRef.validate(
                   async valid=>{
                        if(!valid) return 
                        const {data:res}=await  this.$http.put("users/"+this.editForm.id,{
                            mobile:this.editForm.mobile,
                            email:this.editForm.email
                        })
                        if(res.meta.status !== 200) {
                            return this.$message.error(res.meta.msg)
                        }
                        this.editDialogVisible=false
                        this.getUserList()
                        this.$message.success(res.meta.msg)      
                    }
                ) 
            },
           async deleteUser(id){
               const confirmResult=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                }).catch(err=>err)
                if(confirmResult !=="confirm"){
                    return this.$message.info("用户取消了删除")
                }
                const {data:res} =await this.$http.delete(`users/${id}`)
                if(res.meta.status !==200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getUserList();
      },





            }
        }
    
</script>

<style lang="less" scoped>

</style>