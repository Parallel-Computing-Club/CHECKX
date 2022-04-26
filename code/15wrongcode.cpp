#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
#include<bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> finalPrices(vector<int>& p) {
        int n=p.size();
        stack<int> s;
        vector<int>d (n,-1);
        for(int i=0;i<p.size();i++){
            if(s.size()==0){
                s.push(i);
            }
            else{
                if(p[s.top()]>p[i]){
                    while(!s.empty()&&p[s.top()]>=p[i]){
                         d[s.top()]=i;
                        s.pop();
                    }
                }
                s.push(i);
            }
        }
        vector<int>v;
        for(int i=0;i<n;i++){
            if(d[i]!=-1){
                v.push_back(p[i]-p[d[i]]);
            }
            else{
                v.push_back(p[i]);
            }
        }
        return v;
    }
};

int main(){
    vector<int>v;
    int n;
    cin>>n;
    for(int i=0;i<n;i++){
        int t;
        cin>>t;
        v.push_back(t);
    }
    Solution ob;
    vector<int>ans=ob.finalPrices(v);
    for(int i=0;i < ans.size();i++){
        cout<<ans[i]<<" ";
    }
    return 0;
}