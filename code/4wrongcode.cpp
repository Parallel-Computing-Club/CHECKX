#include<iostream>
#include<vector>
#include<string>
#include<stack>
using namespace std;

class Solution {
public:
    vector<string> ans;
    bool valid(string s){
        if(s[0]=='0'){
            return false;
        }
        int v=stoi(s);
        if(v>255){
            return false;
        }
        return true;
    }
    void helper(string &s,int i,int part,string res){
        if(s.size()==i||part==4){
            if(s.size()==i&&part==4){
                ans.push_back(res.substr(0,res.size()-1));
                return;
            }
            return;
        }
        if(s.size()-i>=1&&valid(s.substr(i,1))){
              helper(s,i+1,part+1,res+s[i]+".");
        }
        if(s.size()-i>=2&&valid(s.substr(i,2))){
              helper(s,i+2,part+1,res+s.substr(i,2)+".");
        }
        if(s.size()-i>=3&&valid(s.substr(i,3))){
              helper(s,i+3,part+1,res+s.substr(i,3)+".");
        }
        return;
    }
    vector<string> restoreIpAddresses(string s) {
        helper(s,0,0,"");
        return ans;
    }
};

int main(){
    string s;
    cin>>s;
    vector<string>v;
    Solution ob;
    v=ob.restoreIpAddresses(s);
    int n=v.size();
    for(int i=0;i<n;i++){
        cout<<v[i];
    }
    cout<<endl;
    return 0;
}