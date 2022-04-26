#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<algorithm>
#include<unordered_map>
using namespace std;

struct Node {
    int val;
    struct Node* next;
    Node(int x) {
        val = x;
        next = NULL;
    }
};

struct Node* buildList(int size)
{
    int val;
    cin>> val;
    
    Node* head = new Node(val);
    Node* tail = head;
    
    for(int i=0; i<size-1; i++)
    {
        cin>> val;
        tail->next = new Node(val);
        tail = tail->next;
    }
    
    return head;
}

void printList(Node* n)
{
    while(n)
    {
        cout<< n->val << " ";
        n = n->next;
    }
    cout<< endl;
}


class Solution
{
    public:
    struct Node* addTwoLists(struct Node* l1, struct Node* l2)
    {
        stack<int>s1;
        stack<int>s2;
        struct Node* h1=l1;
        struct Node* h2=l2;
        while(h1){
            s1.push(l1->val);
            h1=h1->next;
            l1=l1->next;
        }
         while(h2){
            s2.push(l2->val);
            h2=h2->next;
            l2=l2->next;
        }
        int rem=0;
        stack<int>s;
        while(!s1.empty()&&!s2.empty()){
            int k=s1.top()+s2.top()+rem;
            if(k>9){
                s.push(k%10);
                rem=1;
            }
            else{
                s.push(k);
                rem=0;
            }
            s1.pop();
            s2.pop();
        }
        while(!s1.empty()){
            int k=(rem+s1.top());
            if(k>9){
                 s.push(k%10);
                rem=1;
            }
            else{
                 s.push(k);
                rem=0;
            }
                   s1.pop();
        }
        while(!s2.empty()){
            int k=(rem+s2.top());
            if(k>9){
                 s.push(k%10);
                rem=1;
            }
            else{
                 s.push(k);
                rem=0;
            }
            s2.pop();
        }
        if(rem>0){
            s.push(rem);
        }
        struct Node* head=NULL;
        struct Node* tail=NULL;
        while(!s.empty()){
            struct Node* temp=new Node(s.top());
            if(head==NULL){
                head=temp;
                tail=temp; 
            }
            else{
                tail->next=temp;
                tail=tail->next;
            }
            s.pop();
        }
        return head;
    }
};



int main()
{
    int n, m;
    
    cin>>n;
    Node* first = buildList(n);
    
    cin>>m;
    Node* second = buildList(m);
    Solution ob;
    Node* res = ob.addTwoLists(first,second);
    printList(res);
    
    return 0;
}
