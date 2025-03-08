#!/bin/python
import os
import platform

idl_files = {}

def get_thrift_files():
    id = 1
    for file in os.listdir("idl"):
        if file.endswith(".thrift"):
            idl_files[id] = file
            id += 1

def bootstrap():
    get_thrift_files()
    print(idl_files)

    id = int(input("输入要更新idl文件编号(输入0全部更新)："))

    if id == 0:
        system_type = platform.system()
        if system_type == "Windows":
            for idl_file in idl_files.values():
                os.system("hz update -idl ./idl/" + idl_file)
        else:
            os.system("hz update -idl ./idl/*.thrift")
        return

    if idl_files.get(id):
        os.system("hz update -idl ./idl/" + idl_files[id])
    else:
        print("输入的编号不存在")

bootstrap()