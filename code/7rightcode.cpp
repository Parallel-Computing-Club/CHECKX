#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
#include<unordered_map>
using namespace std;

string removeDuplicateLetters(string s) {
        int n=s.size();

        unordered_map<int,int>m;
        for(int i=0;i<n;i++){
            if(!m.count(s[i])){
                m[s[i]]++;
            }
            else{
                m[s[i]]=1;
            }
        }
        
        stack<char>st;
        bool arr[26]={0};
        for(int i=0;i<n;i++){
            if(st.empty()){
                m[s[i]]--;
                st.push(s[i]);
                arr[s[i]-'a'] = 1;
                continue;
            }
            while(!st.empty()&&s[i]<=st.top()&&m[st.top()]!=0&&!arr[s[i]-'a']){
                arr[st.top()-'a']=0;
                
                st.pop(); 
            }
            if(!arr[s[i]-'a']){
                 st.push(s[i]);
                 arr[s[i]-'a']=1;
            }
            m[s[i]]--;
        }
        string ans="";
        while(!st.empty()){
            ans.push_back(st.top());
            st.pop();
        }
        reverse(ans.begin(),ans.end());
        return ans;
}

int main(){
    string s;
    cin>>s;
    string k=removeDuplicateLetters(s);
    cout<<k;
    
}
