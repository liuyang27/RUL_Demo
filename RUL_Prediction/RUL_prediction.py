# -*- coding: utf-8 -*-
"""
Created on Wed June 06 14:44:00 2020

@author: shen yan
"""
import pandas as pd
import pickle
import numpy as np
import time
import platform

print(pd.__version__)
print(platform.python_version())

train_motors=[10,11,12,14,15,17,18,19]
df=pd.read_pickle('feats_time_Motor20')
#print(df)

cycle=8
data=df.iloc[:,0:-2]
X=data.loc[df.Cycle==cycle,:]
HI_t=[]
for motor in train_motors:
    pipe=pickle.load(open('model'+str(motor), 'rb'))
    HI_t.append(pipe.predict(X).mean())
RUL=np.mean(HI_t)
print(str(RUL))

