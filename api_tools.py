#!/bin/python
import os

idl_files={}

def get_thrift_files():
    id=1
    for file in os.listdir("idl"):
        if file.endswith(".thrift"):
            idl_files[id]=file
            id+=1

def bootstrap():
    get_thrift_files()
    print(idl_files)

    id=input("输入要更新idl文件编号(输入0全部更新)：")

    if(int(id)==0):
        os.system("hz update -idl ./idl/*.thrift")
        return
        

    if(idl_files.get(int(id))):
        os.system("hz update -idl ./idl/"+idl_files[int(id)])
    else:
        print("输入的编号不存在")

bootstrap()

