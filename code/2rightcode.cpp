#include<iostream>
#include<vector>
#include<string>
#include<stack>
using namespace std;

int countRev (string s);

int main()
{
    string s; 
    cin >> s;
    cout << countRev (s) << '\n';
}

int countRev (string s){
    stack<char> st;

    if(s.size()%2!=0){
        return -1;
    }

    for(int i=0;i<s.size();i++){
        if(st.empty()){
            st.push(s[i]);
        }
        else{
            if(st.top()=='{'&&s[i]=='}'){
                st.pop();
            }else{
                st.push(s[i]);
            }
        }
    }

    int count=0;

    while(!st.empty()){
        char top=st.top();
        st.pop();
        if(st.top()==top){
            count=count+1;
        }
        else{
           count= count+2;
        }
        st.pop();
    }
    return count;
}