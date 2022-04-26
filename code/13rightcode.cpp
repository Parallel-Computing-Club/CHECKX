#include<iostream>
#include<map>
#include<bits/stdc++.h>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
using namespace std;

class Solution {
public:
    unordered_map<string ,bool>map;
    bool valid(string s){
        if(map[s]){
            return true;
        }
        return false;
    }
    vector<string>ans;
    void helper(string&s,int i,string temp){
        if(i==s.size()){
            ans.push_back(temp);
            return ;
        }
        for(int j=i;j<s.size();j++){
            if(valid(s.substr(i,j-i+1))){
                if(temp.size()!=0){
                    if(temp[temp.size()-1]!=' '){
                         temp+=" ";
                    }
                }
                
                helper(s,j+1,temp+s.substr(i,j-i+1));
            }
        }
        return ;
    }
    vector<string> wordBreak(string s, vector<string>& wordDict) {
  
        for(int i=0;i<wordDict.size();i++){
            map[wordDict[i]]=true;
        }
        helper(s,0,"");
        return ans;
    }
};

int main(){
    string s;
    cin>>s;
    vector<string>dic;
    int l;
    cin>>l;
    for(int i=0;i<l;i++){
        string st;
        cin>>st;
        dic.push_back(st);
    }
    Solution ob;
    vector<string> ans=ob.wordBreak(s,dic);
    for(int i=0;i<ans.size();i++){
        cout<<ans[i]<<" ";
    }
    return 0;
}