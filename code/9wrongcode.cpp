#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
using namespace std;

class Solution {
public:
    string removeKdigits(string num, int k){
        int n=num.size();
        stack<int>s;
        if(num.size()==k){
            return "0";
        }
        for(int i=0;i<n;i++){
            if(s.empty()){
                s.push(num[i]);
                continue;
            }
            else{
                if(s.top()>num[i]){
                    while(!s.empty()&&s.top()>num[i]&&k!=0){
                        s.pop();
                        k--;
                    }
                }
            }
             s.push(num[i]);
        }
        string ans="";
        while(!s.empty()){
            ans.push_back(s.top());
            s.pop();
        }
        while(ans.size()!=0&&ans.back()=='0'){
            ans.pop_back();
        }
        reverse(ans.begin(),ans.end());
        
        if(ans.size()==0||k>ans.size()){
            return "0";
        }
        return ans;
    }
};


int main(){
    string s;
    cin>>s;
    int k;
    cin>>k;
    if(k>s.size()){
        cout<<"NOT Possible";
    }
    Solution ob;
    cout<<ob.removeKdigits(s,k);
    return 0;
}
