---
title: JavaScript 数据结构和算法简述 —— 数组
date: 2015-09-15
author: TAT.李强
source_link: http://www.alloyteam.com/2015/09/brief-javascript-data-structures-and-algorithms-the-array/
---

# 为什么先讲数组

* * *

数据结构可以简单的被分为线性结构和非线性结构。

线性结构大致包括：

1.  数组（连续存储）；
2.  链表（离散存储）；
3.  栈（线性结构常见应用，由链表或数组增删和改进功能实现）；
4.  队列（线性结构常见应用，由链表或数组增删和改进功能实现）；

非线性结构大致包括：

1.  树；
2.  图；

其中，数组是应用最广泛的数据存储结构。它被植入到大部分编程语言中。由于数组十分容易懂，所以它被用来作为介绍数据结构的起点非常合适。

# JavaScript 数组基础知识

* * *

在 ECMAScript 中数组是非常常用的引用类型了。ECMAScript 所定义的数组和其他语言中的数组有着很大的区别。那么首先要说的就是数组在 js 中是一种特殊的对象。

特点：

1.  数组是一组数据的线性集合；
2.  js 数组更加类似 java 中的容器。长度可变，元素类型也可以不同；
3.  数组的长度可以随时修改（length 属性）；

常用操作方法：

-   push、pop
-   shift、unshift
-   splice、slice
-   concat、join、sort、reverse 等

# JavaScript 数组操作

* * *

**一、 数组方法：**

**_1、 数组的创建_**

```javascript
var array = [];
 
var array = new Array();　//创建一个数组
 
var array = new Array([size]);　//创建一个数组并指定长度，注意不是上限，是长度
 
var array = new Array([element0[, element1[, ...[, elementN]]]]);　//创建一个数组并赋值
 
```

注意：虽然第三种方法创建数组指定了长度，但实际上所有情况下数组都是变长的，也就是说即使指定了长度为 5，仍然可以将元素存储在规定长度以外的，并且这时长度会随之改变。

**_2、 数组元素的访问_**

```javascript
var getArrItem = array[1]; //获取数组的元素值
array[1] = "new value"; //给数组元素赋予新的值
```

**_3、 数组元素的添加_**

    array. push([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
     
    array.unshift([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组开始，数组中的元素自动后移，返回数组新长度
     
    array.splice(insertPos,0,[item1[, item2[, . . . [,itemN]]]]);//将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""。
     

**_4、 数组元素的删除_**

    array.pop(); //移除最后一个元素并返回该元素值
     
    array.shift(); //移除最前一个元素并返回该元素值，数组中元素自动前移
     
    array.splice(deletePos,deleteCount); //删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
     
    array.slice(start, [end]); //以数组的形式返回数组的一部分，注意不包括 end 对应的元素，如果省略 end 将复制 start 之后的所有元素
     

**_5、 数组的合并_**

    array.concat([item1[, item2[, . . . [,itemN]]]]); //将多个数组（也可以是字符串，或者是数组和字符串的混合）连接为一个数组，返回连接好的新的数组
     

**_6、 数组的拷贝_**

    array.slice(0); //返回数组的拷贝数组，注意是一个新的数组，不是指向
     
    array.concat(); //返回数组的拷贝数组，注意是一个新的数组，不是指向
     

**_7、 数组元素的排序_**

    array.reverse(); //反转元素（最前的排到最后、最后的排到最前），返回数组地址
     
    array.sort(); //对数组元素排序，返回数组地址
     

**_8、 数组元素的字符串化_**

    array.join(separator); //返回字符串，这个字符串将数组的每一个元素值连接在一起，中间用 separator 隔开。
     
    toLocaleString 、toString 、valueOf：可以看作是join的特殊用法，不常用
     

简单介绍了下数组各个方法的使用，也算是对 js 数组学习的一个 review 和总结，利用这些方法可以实现数组更复杂些的操作，具体大家可以自己去实践。可见，js 数组的功能很强大。

**二、 数组属性**

**_1、 length 属性_**

length 属性表示数组的长度，即其中元素的个数。因为数组的索引总是由 0 开始，所以一个数组的上下限分别是：0 和 length-1。和其他大多数语言不同的是，JavaScript 数组的 length 属性是可变的，这一点需要特别注意。当 length 属性被设置得更大时，整个数组的状态事实上不会发生变化，仅仅是 length 属性变大；当 length 属性被设置得比原来小时，则原先数组中索引大于或等于 length 的元素的值全部被丢失。下面是演示改变 length 属性的例子：

```javascript
var arr = [12, 23, 5, 3, 25, 98, 76, 54, 56, 76];
//定义了一个包含10个数字的数组
print(arr.length); //显示数组的长度10
arr.length = 12; //增大数组的长度
print(arr.length); //显示数组的长度已经变为12
print(arr[8]); //显示第9个元素的值，为56
arr.length = 5; //将数组的长度减少到5，索引等于或超过5的元素被丢弃
print(arr[8]); //显示第9个元素已经变为"undefined"
arr.length = 10; //将数组长度恢复为10
print(arr[8]); //虽然长度被恢复为10，但第9个元素却无法收回，显示"undefined"
```

由上面的代码我们可以清楚的看到 length 属性的性质。但 length 对象不仅可以显式的设置，它也有可能被隐式修改。JavaScript 中可以使用一个未声明过的变量，同样，也可以使用一个未定义的数组元素（指索引超过或等于 length 的元素），这时，length 属性的值将被设置为所使用元素索引的值加 1。例如下面的代码：

```javascript
var arr = [12, 23, 5, 3, 25, 98, 76, 54, 56, 76];
print(arr.length); // 10
arr[15] = 34;
print(arr.length); // 16
```

代码中同样是先定义了一个包含 10 个数字的数组，可以看出其长度为 10。随后使用了索引为 15 的元素，将其赋值为 15，即 arr\[15]=34，这时再输出数组的长度，得到的是 16。无论如何，对于习惯于强类型编程的开发人员来说，这是一个很令人惊讶的特性。事实上，使用 new Array () 形式创建的数组，其初始长度就是为 0，正是对其中未定义元素的操作，才使数组的长度发生变化。

综上，利用 length 属性可以方便的增加或者减少数组的容量。

**_2、 prototype 属性_**

返回对象类型原型的引用。prototype 属性是 object 共有的。

objectName.prototype

objectName 参数是 object 对象的名称。

对于数组对象，以下例子说明 prototype 属性的用途。

给数组对象添加返回数组中最大元素值的方法。要完成这一点，声明一个函数，将它加入 Array.prototype， 并使用它。

```javascript
function array_max() {
    var i,
        max = this[0];
    for (i = 1; i < this.length; i++) {
        if (max < this[i]) max = this[i];
    }
    return max;
}
Array.prototype.max = array_max;
var x = new Array(1, 2, 3, 4, 5, 6);
print(x.max()); // 6
```

**_3、 constructor 属性_**

表示创建对象的函数。

object.constructor//object 是对象或函数的名称。

说明：constructor 属性是所有具有 prototype 的对象的成员。constructor 属性保存了对构造特定对象实例的函数的引用。

```javascript
x = new Array();
print(x.constructor === Array); // true
```

# JavaScript 数组算法的 C 语言实现

* * *

使用没有指针的语言，个人觉得无法将数据结构和算法的精髓讲的出来，而且 js 底层已将数组相关算法封装好，所以这里不使用原生的 js 或者 java 等，而是使用 c 语言来实现。为了照顾没有学过指针的同学，我会尽可能的简单实现，并写好注释，画好图解，大家可以体会一下。

```c
# include <stdio.h>
# include <malloc.h>  //包含了malloc函数
# include <stdlib.h>  //包含了exit函数
 
//定义了一个数据类型，该数据类型的名字叫做struct Arr, 该数据类型含有三个成员，分别是pBase, len, cnt
struct Arr
{
    int * pBase; //存储的是数组第一个元素的地址
    int len; //数组所能容纳的最大元素的个数
    int cnt; //当前数组有效元素的个数
};
 
void init_arr(struct Arr *, int);  //初始化数组
bool is_empty(struct Arr *); // 数组是否为空 
bool is_full(struct Arr *); // 数组是否已满 
bool push(struct Arr *, int); //追加元素 
void sort(struct Arr *); // 排序 
void reverse(struct Arr *); // 逆序 
bool insert(struct Arr *, int, int); // 插入元素 
bool del(struct Arr *, int, int *); // 删除元素 
void show_arr(struct Arr *); // 打印数组 
 
int main(void) {
    struct Arr arr;
 
    int val; // 存储删除元素 
 
    init_arr(&arr, 6); // 初始化数组 
    show_arr(&arr);
 
    push(&arr, 4); // 在尾部追加元素 
    push(&arr, 1);
    push(&arr, -1);
    push(&arr, 10);
    push(&arr, 0);
    push(&arr, 6);
    show_arr(&arr);
 
    sort(&arr); // 排序 
    show_arr(&arr); 
 
    reverse(&arr); // 逆序 
    show_arr(&arr);
 
    del(&arr, 4, &val); // 删除指定位置元素 
    printf("您删除的元素是: %d\n", val);
    show_arr(&arr);
 
    insert(&arr, 4, 20); // 在指定位置插入元素 
    show_arr(&arr);
 
    return 0;
}
 
void init_arr(struct Arr * pArr, int length) {
    pArr->pBase = (int *)malloc(sizeof(int) * length);
    if(NULL == pArr->pBase) {
        printf("动态内存分配失败!\n");
        exit(-1); //终止整个程序
    }
    else {
        pArr->len = length;
        pArr->cnt = 0;
    }
    return;
}
 
bool is_empty(struct Arr * pArr) {
    if(0 == pArr->cnt) {
        return true;
    } else {
        return false;   
    }       
}
 
bool is_full(struct Arr * pArr) {
    if (pArr->cnt == pArr->len) {
        return true;
    } else {
        return false;
    }
}
 
void show_arr(struct Arr * pArr) {
    if(is_empty(pArr)) {
        printf("数组为空!\n");
    } else {
        for(int i=0; i<pArr->cnt; ++i) {
            printf("%d  ", pArr->pBase[i]);
        }
        printf("\n");
    }
}
 
bool push(struct Arr * pArr, int val) {
    //满了就返回false
    if(is_full(pArr)) {
        return false;
    }
    //不满时追加
    pArr->pBase[pArr->cnt] = val; 
    (pArr->cnt)++;
    return true;
}
 
void sort(struct Arr * pArr) {
    int i, j, t;
    // 简单的冒泡排序法实现，后面的章节会单独讲排序算法 
    for(i=0; i<pArr->cnt; ++i) {
        for(j=i+1; j<pArr->cnt; ++j) {
            if(pArr->pBase[i] > pArr->pBase[j]) {
                t = pArr->pBase[i];
                pArr->pBase[i] = pArr->pBase[j];
                pArr->pBase[j] = t;
            }
        }
    }
}
 
void reverse(struct Arr * pArr) {
    int i = 0;
    int j = pArr->cnt-1;
    int t;
    // 当i<j时，置换i和j位置的元素 
    while(i < j) {
        t = pArr->pBase[i];
        pArr->pBase[i] = pArr->pBase[j];
        pArr->pBase[j] = t;
        ++i;
        --j;
    }
    return;
}
 
bool insert(struct Arr * pArr, int pos, int val) {
    int i;
    // 满了就算了 
    if(is_full(pArr)) {
        return false;
    }
    // 如果插入的位置不在数组有效范围内就算了 
    if(pos<1 || pos>pArr->cnt+1) {
        return false;
    }
    // 从插入位置开始后移各元素，将插入位置空出 
    for(i=pArr->cnt-1; i>=pos-1; --i) {
        pArr->pBase[i+1] = pArr->pBase[i];
    }
    // 给插入位置的元素赋值 
    pArr->pBase[pos-1] = val;
    //数组有效长度自增 
    (pArr->cnt)++;
    return true;
}
 
bool del(struct Arr * pArr, int pos, int * pVal) {
    int i;
    // 空就算了 
    if(is_empty(pArr)) {
        return false;
    }
    // 不在有效范围内就算了 
    if (pos<1 || pos>pArr->cnt) {
        return false;
    }
    // 存储被删除元素 
    *pVal = pArr->pBase[pos-1];
    // 从删除位置开始，前移各元素，将删除位置堵死 
    for (i=pos; i<pArr->cnt; ++i) {
        pArr->pBase[i-1] = pArr->pBase[i];
    }
    // 数组有效长度自减 
    pArr->cnt--;
    return true;
}
 
```

**执行结果：**

![](http://i.imgur.com/Ty4dTF4.png)

**程序图解：**

![](http://i.imgur.com/xta5aTM.gif)

# 衡量算法的标准

* * *

需要详细了解的同学请阅读相关书籍。这里我简单介绍一下。

**_1、 时间复杂度_**

程序大概要执行的次数，而非执行的时间

通常使用大 O 表示法（含义："order of" 大约是）来表示。比如无序数组的插入，无论数组中有多少数据项，都只需要在下一个有空的地方进行一步插入操作，那么可以说向一个无序数组中插入一个数据项的时间 T 是一个常数 K： T=K；又比如线性查找，查找特定数据项所需的比较次数平均为数据项总数的一半，因此可以说：T=K_N/2，为了得到更加简洁的公式，可以将 2 并入 K，可以得到：T=K_N。大 O 表示法同上面的公式比较类似，但是它省略了常数 K。当比较算法时，并不在乎具体的处理器或者编译器，真正需要比较的是对应不同的 N 值 T 是怎样变化的，而不是具体的数字。

**用大 O 表示法表示数组相关算法运行时间：**

| 算法      | 大 O 表示法 |
| ------- | ------- |
| 线性查找    | O(N)    |
| 二分查找    | O(logN) |
| 无序数组的插入 | O(1)    |
| 有序数组的插入 | O(N)    |
| 无序数组的删除 | O(N)    |
| 有序数组的删除 | O(N)    |

注：O (1) 是优秀；O (logN) 是良好；O (N) 还可以；O (N2) 就差一些了。

**_2、 空间复杂度_**

算法执行过程中大概所占用的最大内存

**_3、 难易程度_**

写出来的算法不能只让自己看得懂，或者自己写完以后自己也看不懂了。。。

**_4、 健壮性_**

不能一用就崩溃。。。

# 为什么不用数组表示一切

* * *

仅用数组看似可以完成所有的工作，那么为什么不用它来进行所有的数据存储呢？

在一个无序数组中可以很快进行插入（O (1)），但是查找却要花费较多的时间 O (N)。在一个有序数组中可以查找的很快（O (logN)），但是插入却要 O (N)。对于有序和无序数组，由于平均半数的数据项需要移动，所以删除操作平均需要花费 O (N)。

如果有一种数据结构进行任何插入、删除和查找操作都很快（O (1) 或者 O (logN)）, 那就太爽了哈。后面我们会向这一目标靠近。