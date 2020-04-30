<template>
    <div>
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="10">
                <el-col :span="6"><el-button type="primary" @click="showAddRoleDialog">添加角色</el-button></el-col>
            </el-row>

             <el-table
            :data="rolelist"
            border
            stripe
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- <pre>{{scope.row}}</pre> -->
                    <el-row :class="['bdboottom','vcenter',i1===0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5" >
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级三级权限 -->
                        <el-col :span="19">
                            <el-row :class="['vcenter',i2===0? '' :'bdbottom']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="13">
                                  <el-tag 
                                  @close="removeRightById(scope.row,item3.id)"
                                  closable type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    
                </template>
            </el-table-column>
            <el-table-column type="index" label="序号">
            </el-table-column>

            <el-table-column
                prop="roleName"
                label="角色名称" >
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述" >
            </el-table-column>
            <el-table-column
                label="操作" width="300px">
                <template slot-scope="scope">
                   <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)" >编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeRoleById(scope.row.id)">删除</el-button>
                    <el-tooltip  effect="dark" content="分配角色"  placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)" size="mini">分配权限</el-button>
                        </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        </el-card>
    <!-- 分配角色对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisable"
            width="50%"
            @close="setRightDialogClosed"
            >
            <!-- 树形控件 -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id"
            default-expand-all :default-checked-keys="defKeys" ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisable = false">取 消</el-button>
                <el-button type="primary"  @click="allotRights"
                >确 定</el-button>
            </span>
        </el-dialog>
    <!-- 添加角色对话框 -->
            <el-dialog
            :close-on-click-modal="false"
            title="添加角色"
            :visible.sync="addRoleDialogVisable"
            width="50%"
             @close="addRoleFormClose"
            >
            <el-form ref="addRoleFormRef" :model="addRoleForm" label-width="80px" :rules="addRoleFormRule" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisable = false">取 消</el-button>
                <el-button type="primary"  @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->

            <el-dialog
            :close-on-click-modal="false"
            title="编辑角色"
            :visible.sync="editRoleDialogVisable"
            width="50%"
            @close="editRoleDialogClose"
            >
            <el-form ref="editRoleFormRef" :model="editRoleForm" label-width="80px" :rules="addRoleFormRule" >
                <el-form-item label="角色ID" >
                    <el-input v-model="editRoleForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisable = false">取 消</el-button>
                <el-button type="primary"  @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created(){
            this.getRolesList()
        },
        data(){
            return {
                rolelist:[],
                setRightDialogVisable:false,
                rightslist:[],
                treeProps:{
                    label:"authName",
                    children:"children"
                },
                defKeys:[],
                roleId:"",
                addRoleDialogVisable:false,
                addRoleForm:{
                    roleName:'',
                    roleDesc:''
                },
                editRoleDialogVisable:false,
                editRoleForm:{
                    id:'',
                    roleName:'',
                    roleDesc:''
                },
                addRoleFormRule:{
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    roleDesc:[
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                    ]
                },
                   
                
            }
        },
        methods:{
          async  getRolesList(){
            const {data:res}=await   this.$http.get("roles")

            if(res.meta.status !==200) return this.$message.error("获取角色列表失败")
            this.rolelist=res.data
            },
        async    removeRightById(role,rightId){
           const confirmResult=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch(err=>err)
                 if(confirmResult !== "confirm") return this.$message.error("取消了删除")
                 
             const {data:res}= await  this.$http.delete(`roles/${role.id}/rights/${rightId}`) 
             if(res.meta.status !==200) return this.$message.error("删除权限失败") 
             role.children=res.data   
            },
          async  showSetRightDialog(role){
              this.roleId=role.id
             const {data:res}=await  this.$http.get(`rights/tree`)
             if(res.meta.status !== 200) return this.$message.error("获取用户列表失败")
             this.rightslist=res.data
             this.getLeafKeys(role,this.defKeys)
             this.setRightDialogVisable=true
                
            },
            // 通过递归的形式获取三级权限的id
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item,arr)
                })
            },
            setRightDialogClosed(){
                this.defKeys=[]
            },
          async  allotRights(){
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
               const idStr=keys.join(",")
               
             const {data:res}=await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
             if(res.meta.status !== 200){
                 return this.$message.error("分配权限失败")
             }
             this.$message.success("分配权限成功")
             this.getRolesList()
             this.setRightDialogVisable=false
            },
            showAddRoleDialog(){
                this.addRoleDialogVisable=true
            },
            addRoleFormClose(){
                this.$refs.addRoleFormRef.resetFields()
            },
            addRole(){
                this.$refs.addRoleFormRef.validate( async valid=>{
                    if(!valid){
                       return 
                    }
               const {data:res}=await this.$http.post("roles",this.addRoleForm)
               
               if(res.meta.status !== 201){
                   return this.$message.error("添加角色失败")
               }
               console.log(res)
               this.$message.success(res.meta.msg)
               this.getRolesList()
               this.addRoleDialogVisable=false
                    
                })
            },
        async    removeRoleById(roleid){
            const confirmResult=await this.$confirm('此操作将永久删除该用户名, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).catch(err=>err)
            if(confirmResult!=="confirm"){
                return this.$message.info("用户取消了操作")
            }
            const  {data:res}=await this.$http.delete(`roles/${roleid}`)
            if(res.meta.status !==200) return this.$message.erroe("删除角色失败")
            this.$message.success(res.meta.msg)
            this.getRolesList()
            },
            showEditDialog(roleInfo){
                this.editRoleForm=roleInfo
                this.editRoleDialogVisable=true
            },
          editRole(){
              const confirmResult= this.$refs.editRoleFormRef.validate( async valid=>{
                  if(!valid) return 
              const {data:res}=await this.$http.put(`roles/${this.editRoleForm.id}`,this.editRoleForm)
                if(res.meta.status !== 200){
                    return this.$message.error("编辑用户失败")
                }
                this.$message.success("编辑用户成功")
                this.editRoleDialogVisable=false
                this.getRolesList();
                })
            },
            editRoleDialogClose(){
                this.$refs.editRoleFormRef.resetFields()
            }
        }
    }
</script>

<style  scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top: 1px solid #eee;
}

.bdboottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>