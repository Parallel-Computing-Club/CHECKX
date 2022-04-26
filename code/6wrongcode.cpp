#include <bits/stdc++.h>
using namespace std;

struct Node
{
    int data;
    struct Node *left;
    struct Node *right;

    Node(int val) {
        data = val;
        left = right = NULL;
    }
}; 

Node* buildTree(string str)
{   
    if(str.length() == 0 || str[0] == 'N')
        return NULL;
    
    vector<string> ip;
    
    istringstream iss(str);
    for(string str; iss >> str; )
        ip.push_back(str);
        
    Node *root = new Node(stoi(ip[0]));
        
    queue<Node*> queue;
    queue.push(root);
        
    int i = 1;
    while(!queue.empty() && i < ip.size()) {
        Node* currNode = queue.front();
        queue.pop();
            
        string currVal = ip[i];
            
        if(currVal != "N") {
            currNode->left = new Node(stoi(currVal));
                
            queue.push(currNode->left);
        }
            
        i++;
        if(i >= ip.size())
            break;
        currVal = ip[i];
            
        if(currVal != "N") {
            currNode->right = new Node(stoi(currVal));
                
            queue.push(currNode->right);
        }
        i++;
    }
    
    return root;
}



class Solution {
public:
    int count(Node* root){
        if(root==NULL){
            return 0;
        }
        return 1+count(root->left)+count(root->right);
    }
    int hight(Node* root){
        if(root==NULL){
            return 0;
        }
        return 1+min(hight(root->left),hight(root->right));
    }
    int minDepth(Node* root) {
        if(root==NULL){
            return 0;
        }
        int c=count(root);
            int h=hight(root);
        if(h==1){
            return c;
        }
        return h;
    }
};;

int main()
{
    string treeString;
	getline(cin,treeString);
	Node* root = buildTree(treeString);
    Solution ob;
	cout<<ob.minDepth(root)<<endl;
    return 0;
} 