let datakey;
let carrinho=[];
let modalqt=1;
function c(e){return document.querySelector(e);}
function cs(e){return document.querySelectorAll(e);}


//listagem das pizzas
pizzaJson.map(function(item, index ) {
   let pizzaItem = c('.pizza-item').cloneNode(true); // clonando a div pizza-item e seu conteudo 
   //adicionando os elementos ao clone criado      
   c('.pizza-area').append(pizzaItem);                
   pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;
   pizzaItem.querySelector('.pizza-item--price').innerHTML='R$: '+item.price.toFixed(2);
   //coloco a imagem dentro de src existente
   pizzaItem.querySelector('.pizza-item--img img').src=item.img;

   
   //abrindo o modal 
   pizzaItem.querySelector('a').addEventListener('click',(e)=>{
     //cancelando o evento de click da teg a
     e.preventDefault();
     modalqt=1;
     //aparece o modal lentamente 
     c('.pizzaWindowArea').style.opacity=0;
     c('.pizzaWindowArea').style.display='flex';
     setTimeout(()=>{c('.pizzaWindowArea').style.opacity=1;},200);
   
     //pego o atributo pizza-key criando 
     //target para pegar o proprio elemento e closest pega o mais proximo desse elemento 
     let key = e.target.closest('.pizza-item').getAttribute('data-key');
     datakey=key;
     document.querySelector('.pizzaBig img').src=pizzaJson[key].img;
     document.querySelector('.pizzaInfo h1').innerHTML=pizzaJson[key].name;
     document.querySelector('.pizzaInfo--desc').innerHTML=pizzaJson[key].description;
     document.querySelector('.pizzaInfo--actualPrice').innerHTML='R$: '+pizzaJson[key].price.toFixed(2);
     
     document.querySelector('.pizzaInfo--qt').innerHTML=modalqt;

     //removendo a seleção da pizza grande
     document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
    
     //document.querySelector('.pizzaInfo--cancelButton').setAttribute('onclick','fechar()');
     //document.querySelector('.pizzaInfo--addButton').setAttribute('onclick','fechar()');
     //c('.pizzaInfo--cancelMobileButton').setAttribute('onclick','fechar()');

     document.querySelectorAll('.pizzaInfo--size').forEach((size,indexSize)=>{
       size.querySelector('span').innerHTML=pizzaJson[key].sizes[indexSize];
       if(indexSize==2){
        //acessar o elemento e adicionar o selected para resetar a seleção toda vez que fechar o modal
        size.classList.add('selected');
      }
     }) 
   });
   // crio um atributo pizza-key na teg pizza-item para saber qual pizza estou clicando
   pizzaItem.setAttribute('data-key',index);
});





//ações do modal
function fechar(){
  c('.pizzaWindowArea').style.opacity=0;
  setTimeout(()=>c('.pizzaWindowArea').style.display='none',400); 
} 
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--addButton, .pizzaInfo--cancelButton').forEach((item)=>{
  item.addEventListener('click',fechar);
  
});

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
  if(modalqt>1){
    modalqt--;
  c('.pizzaInfo--qt').innerHTML=modalqt;
  }
});

c('.pizzaInfo--qtmais').addEventListener('click',()=>{
  modalqt++;
  c('.pizzaInfo--qt').innerHTML=modalqt;
});
//selecionando o botao
cs('.pizzaInfo--size').forEach((item)=>{
   
      item.addEventListener('click',()=>{
      c('.pizzaInfo--size.selected').classList.remove('selected');
      item.classList.add('selected');
   });
});
//adicionei ao carrinho qual, quantas e o tamanho 
c('.pizzaInfo--addButton').addEventListener('click',()=>{
   let tamanho=parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
   let identify=pizzaJson[datakey].id+'&'+tamanho;
   let key= carrinho.findIndex((item)=>item.identify==identify);
   //estou colocando aquantidade no mesmo array quando o identify e o mesmo 
   if(key > -1){
      carrinho[key].quantidade+=modalqt;
   }
   else{
    carrinho.push({
      identify,
      id:pizzaJson[datakey].id,
      tamanho,
      quantidade:modalqt
    });
   }
   updatecard();
});
c('.menu-openner').addEventListener('click',()=>{
  if(carrinho.length){
    c('aside').style.left='0';
  }
  
});
c('.menu-closer').addEventListener('click',()=>{
  c('aside').style.left='100vw';
});

function updatecard(){
  c('.menu-openner span').innerHTML=carrinho.length;
  if(carrinho.length>0){
    //let item = carrinho.find((item)=> carrinho.id==item.id);
    c('.cart').innerHTML='';

      let subtotal=0;
      let desconto=0;
      let total=0;
      for(let i in carrinho){
        
        let pizzaitem = pizzaJson.find((itemJson)=>itemJson.id==carrinho[i].id);
        subtotal+=carrinho[i].quantidade*pizzaitem.price;
        //clonando o card--item no models
        let pizzacard=c('.models .cart--item').cloneNode(true);
        let nome=pizzaitem.name;
        let tamanho=carrinho[i].tamanho;
        switch (carrinho[i].tamanho) {
          case 0:
              tamanho='P';
            break;
            case 1:
            tamanho='M';
          break;
          case 2:
              tamanho='G';
            break;
          default:
            break;
        }
        let nomeTamanho=`${nome}(${tamanho})`;
        pizzacard.querySelector('.cart--item-nome').innerHTML=nomeTamanho;
        pizzacard.querySelector('img').src=pizzaitem.img;
        pizzacard.querySelector('.cart--item--qt').innerHTML=carrinho[i].quantidade;
        
        pizzacard.querySelector('.cart--item-qtmenos').addEventListener('click',(item)=>{
          if(carrinho[i].quantidade>1){
            carrinho[i].quantidade--;
            updatecard();
          }else{
            carrinho.splice(i,1);
            updatecard();
          }
        });
        pizzacard.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
            carrinho[i].quantidade++;
            updatecard();
            
        });
        c('.cart').append(pizzacard);
      };
      desconto=subtotal*0.1;
      total=subtotal-desconto;
      c('.subtotal span:last-child').innerHTML=`R$ ${subtotal.toFixed(2)}`;
      c('.desconto span:last-child').innerHTML=`R$ ${desconto.toFixed(2)}`;
      c('.total span:last-child').innerHTML=`R$ ${total.toFixed(2)}`;
     c('aside').classList.add('show');
     
     c('.valor-pizza span').innerHTML=total.toFixed(2);
     //abrir menu no mobile
     
     
  }
  else{
    c('aside').classList.remove('show');
    c('aside').style.left="100vw";
  }
}

c('.cart--finalizar').addEventListener('click',()=>{
  c('.modal-finalizar').classList.add('visivel');
  setTimeout(()=>{c('.visivel').style.opacity='1'},200);
});
c('.nao').addEventListener('click',()=>{
  c('.visivel').style.opacity='0';
  setTimeout(()=>{c('.modal-finalizar').classList.remove('visivel')},200);
  
});
c('.sim').addEventListener('click',()=>{
  c('.visivel').style.opacity='0';
  setTimeout(()=>{c('.modal-finalizar').classList.remove('visivel')},200);
  c('.modal-sucesso').style.display='flex';
  setTimeout(()=>{c('.modal-sucesso').style.opacity='1'},200);
 
});
c('.modal-sucesso button').addEventListener('click',()=>{
  c('.modal-sucesso').style.display='none';
});













let vet = [{id:0, nome:'fabio',idade:39},{id:1, nome:'ana',idade:40},{id:3, nome:'ruth',idade:6},{id:4, nome:'joao',idade:9}];

let nome='fabio';
let frase = `meu nome e ${nome}`;

//console.log(frase);













