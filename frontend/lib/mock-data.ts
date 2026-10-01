/**
 * MOCK TEMPORÁRIO — dados reais do banco, fixados em 01/10/2026 (80 produtos,
 * 8 categorias, 3 pedidos) porque o backend está em alteração por outra pessoa.
 *
 * COMO USAR: rode o frontend com NEXT_PUBLIC_USE_MOCK=true (já vem em
 * frontend/.env.local). O lib/api.ts troca o `api` real por este mock e simula
 * delay de rede (MOCK_DELAY_MS) para testar skeletons/loadings.
 *
 * COMO REMOVER: delete este arquivo + frontend/.env.local e reverta o bloco
 * USE_MOCK no topo de frontend/lib/api.ts. Nenhum outro arquivo foi alterado.
 */

import type {
  BackendCategory,
  BackendProduct,
  BackendUser,
  BackendOrder,
  BackendOrderDTO,
  BackendLoginDTO,
  BackendRegisterDTO,
} from "./types";

/** Delay simulado de rede (ms) — ajuste para testar skeletons. */
export const MOCK_DELAY_MS = 800;

export function mockDelay(): Promise<void> {
  const jitter = Math.floor(Math.random() * 400);
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS + jitter));
}

// ---- Categorias (snapshot real do banco) ----
const mockCategories: BackendCategory[] = [{"id": 1, "name": "Caseiro"}, {"id": 2, "name": "Diet"}, {"id": 3, "name": "Vulcão"}, {"id": 4, "name": "Bolo"}, {"id": 5, "name": "Salgado"}, {"id": 6, "name": "Pudim"}, {"id": 7, "name": "Cesta"}, {"id": 8, "name": "Congelado"}];

// ---- Produtos (snapshot real do banco) ----
const initialProducts: BackendProduct[] = [
  {"id": 1, "name": "Bolo de Cenoura", "description": "Bolo de cenoura 45x45 com cobertura de chocolate", "price": 65.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Cenoura", "Chocolate", "Farinha de trigo", "Açúcar", "Ovos"]},
  {"id": 2, "name": "Bolo de Fubá", "description": "Bolo de fubá cremoso tradicional", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Fubá", "Leite", "Ovos", "Açúcar", "Queijo"]},
  {"id": 3, "name": "Bolo de Laranja", "description": "Bolo de laranja com calda natural", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Laranja", "Farinha", "Açúcar", "Ovos", "Óleo"]},
  {"id": 4, "name": "Bolo de Coco", "description": "Bolo de coco com cobertura de coco queimado", "price": 58.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Coco ralado", "Leite de coco", "Farinha", "Açúcar", "Ovos"]},
  {"id": 5, "name": "Pão de Mel", "description": "Pão de mel recheado com doce de leite", "price": 45.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Mel", "Chocolate", "Doce de leite", "Farinha", "Canela"]},
  {"id": 6, "name": "Biscoito de Nata", "description": "Biscoito de nata caseiro polvilhado com açúcar", "price": 25.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Nata", "Farinha", "Açúcar", "Ovos"]},
  {"id": 7, "name": "Torta de Limão", "description": "Torta de limão com merengue", "price": 62.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Limão", "Leite condensado", "Massa", "Ovos", "Açúcar"]},
  {"id": 8, "name": "Torta de Maçã", "description": "Torta de maçã com canela e crumble", "price": 60.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Maçã", "Canela", "Massa", "Açúcar", "Manteiga"]},
  {"id": 9, "name": "Bolo de Banana", "description": "Bolo de banana com aveia e canela", "price": 48.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Banana", "Aveia", "Canela", "Açúcar", "Ovos"]},
  {"id": 10, "name": "Empadinha Caseira", "description": "Empadinha de frango com catupiry (unidade)", "price": 8.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Frango", "Catupiry", "Massa podre", "Milho", "Azeitona"]},
  {"id": 11, "name": "Bolo de Cenoura Fit", "description": "Bolo de cenoura sem açúcar e sem glúten", "price": 52.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Cenoura", "Aveia", "Mel", "Ovos", "Óleo de coco"]},
  {"id": 12, "name": "Bolo de Coco Zero", "description": "Bolo de coco sem lactose e sem açúcar", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Coco", "Farinha de amêndoas", "Adoçante", "Ovos", "Leite vegetal"]},
  {"id": 13, "name": "Brownie Fit", "description": "Brownie de chocolate com cacau 70% sem glúten", "price": 42.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Cacau 70%", "Farinha de amêndoas", "Adoçante", "Ovos", "Manteiga"]},
  {"id": 14, "name": "Torta de Limão Diet", "description": "Torta de limão com base de castanhas", "price": 58.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Castanha do Pará", "Limão", "Leite condensado diet", "Adoçante"]},
  {"id": 15, "name": "Muffin Integral", "description": "Muffin integral de banana com aveia", "price": 38.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Banana", "Farinha integral", "Aveia", "Mel", "Ovos"]},
  {"id": 16, "name": "Pão de Mel Fit", "description": "Pão de mel integral sem açúcar", "price": 48.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Farinha integral", "Mel", "Chocolate 70%", "Canela"]},
  {"id": 17, "name": "Cookie de Aveia", "description": "Cookie integral de aveia com gotas de chocolate", "price": 32.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Aveia", "Chocolate 70%", "Mel", "Manteiga"]},
  {"id": 18, "name": "Bolo de Laranja Fit", "description": "Bolo de laranja integral sem açúcar", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Laranja", "Farinha integral", "Adoçante", "Ovos", "Óleo de coco"]},
  {"id": 19, "name": "Cheesecake Fit", "description": "Cheesecake de frutas vermelhas sem açúcar", "price": 65.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Cream cheese", "Frutas vermelhas", "Base de castanhas", "Adoçante"]},
  {"id": 20, "name": "Panqueca de Banana", "description": "Panqueca de banana com whey protein (unidade)", "price": 12.0, "imageUrl": undefined, "available": true, "category": {"id": 2, "name": "Diet"}, "ingredients": ["Banana", "Whey protein", "Aveia", "Ovos", "Canela"]},
  {"id": 21, "name": "Bolo Vulcão de Chocolate", "description": "Bolo de chocolate com recheio de brigadeiro derretido", "price": 78.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Chocolate", "Brigadeiro", "Farinha", "Açúcar", "Ovos"]},
  {"id": 22, "name": "Bolo Vulcão de Doce de Leite", "description": "Bolo de baunilha com vulcão de doce de leite", "price": 75.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Doce de leite", "Baunilha", "Farinha", "Açúcar", "Ovos"]},
  {"id": 23, "name": "Bolo Vulcão de Morango", "description": "Bolo de nata com vulcão de geleia de morango", "price": 82.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Morango", "Geleia", "Nata", "Farinha", "Açúcar"]},
  {"id": 24, "name": "Bolo Vulcão de Coco", "description": "Bolo de coco com vulcão de beijinho", "price": 72.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Coco", "Leite condensado", "Farinha", "Açúcar", "Ovos"]},
  {"id": 25, "name": "Bolo Vulcão de Ninho", "description": "Bolo de leite Ninho com vulcão de creme de Ninho", "price": 80.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Leite Ninho", "Leite condensado", "Farinha", "Açúcar", "Ovos"]},
  {"id": 26, "name": "Bolo Vulcão de Prestígio", "description": "Bolo de chocolate com vulcão de coco e brigadeiro", "price": 85.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Chocolate", "Coco", "Brigadeiro", "Farinha", "Açúcar"]},
  {"id": 27, "name": "Bolo Vulcão de Maracujá", "description": "Bolo de maracujá com vulcão de creme de maracujá", "price": 76.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Maracujá", "Leite condensado", "Farinha", "Açúcar", "Ovos"]},
  {"id": 28, "name": "Bolo Vulcão de Romeu e Julieta", "description": "Bolo de queijo com vulcão de goiabada", "price": 78.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Queijo", "Goiabada", "Farinha", "Açúcar", "Ovos"]},
  {"id": 29, "name": "Bolo Vulcão de Amendoim", "description": "Bolo de amendoim com vulcão de paçoca", "price": 74.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Amendoim", "Paçoca", "Leite condensado", "Farinha", "Açúcar"]},
  {"id": 30, "name": "Bolo Vulcão de Oreo", "description": "Bolo de baunilha com vulcão de creme de Oreo", "price": 86.0, "imageUrl": undefined, "available": true, "category": {"id": 3, "name": "Vulcão"}, "ingredients": ["Oreo", "Baunilha", "Farinha", "Açúcar", "Ovos"]},
  {"id": 31, "name": "Bolo de Chocolate", "description": "Bolo de chocolate com cobertura de ganache", "price": 70.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Chocolate", "Creme de leite", "Farinha", "Açúcar", "Ovos"]},
  {"id": 32, "name": "Bolo de Baunilha", "description": "Bolo de baunilha com recheio de brigadeiro branco", "price": 68.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Baunilha", "Leite condensado", "Farinha", "Açúcar", "Ovos"]},
  {"id": 33, "name": "Bolo de Morango", "description": "Bolo de nata com morangos frescos", "price": 75.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Morango", "Nata", "Farinha", "Açúcar", "Ovos"]},
  {"id": 34, "name": "Bolo de Limão", "description": "Bolo de limão com cobertura de merengue", "price": 62.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Limão", "Merengue", "Farinha", "Açúcar", "Ovos"]},
  {"id": 35, "name": "Bolo de Coco Cremoso", "description": "Bolo de coco com recheio cremoso", "price": 66.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Coco", "Leite condensado", "Farinha", "Açúcar", "Ovos"]},
  {"id": 36, "name": "Bolo de Milho", "description": "Bolo de milho cremoso tradicional", "price": 58.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Milho", "Leite de coco", "Farinha", "Açúcar", "Ovos"]},
  {"id": 37, "name": "Bolo de Amendoim", "description": "Bolo de amendoim com cobertura de paçoca", "price": 64.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Amendoim", "Paçoca", "Farinha", "Açúcar", "Ovos"]},
  {"id": 38, "name": "Bolo de Iogurte", "description": "Bolo de iogurte natural com frutas", "price": 60.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Iogurte", "Frutas", "Farinha", "Açúcar", "Ovos"]},
  {"id": 39, "name": "Bolo Red Velvet", "description": "Bolo red velvet com cream cheese frosting", "price": 85.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Cream cheese", "Corante", "Farinha", "Açúcar", "Ovos", "Manteiga"]},
  {"id": 40, "name": "Bolo de Cerveja Preta", "description": "Bolo de cerveja preta com calda de caramelo", "price": 72.0, "imageUrl": undefined, "available": true, "category": {"id": 4, "name": "Bolo"}, "ingredients": ["Cerveja preta", "Caramelo", "Farinha", "Açúcar", "Ovos"]},
  {"id": 41, "name": "Coxinha de Frango", "description": "Coxinha de frango com catupiry (unidade)", "price": 7.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Frango", "Catupiry", "Farinha", "Temperos"]},
  {"id": 42, "name": "Empada de Frango", "description": "Empada de frango com milho e azeitona (unidade)", "price": 8.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Frango", "Milho", "Azeitona", "Massa podre"]},
  {"id": 43, "name": "Empada de Palmito", "description": "Empada de palmito (unidade)", "price": 9.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Palmito", "Azeitona", "Massa podre"]},
  {"id": 44, "name": "Risole de Carne", "description": "Risole de carne moída (unidade)", "price": 7.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Carne moída", "Farinha", "Temperos"]},
  {"id": 45, "name": "Kibe", "description": "Kibe frito tradicional (unidade)", "price": 6.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Carne moída", "Trigo para kibe", "Hortelã", "Temperos"]},
  {"id": 46, "name": "Esfiha de Carne", "description": "Esfiha aberta de carne (unidade)", "price": 7.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Carne moída", "Massa", "Temperos", "Limão"]},
  {"id": 47, "name": "Esfiha de Queijo", "description": "Esfiha de queijo com orégano (unidade)", "price": 7.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Queijo", "Orégano", "Massa"]},
  {"id": 48, "name": "Pastel Assado", "description": "Pastel assado de frango (unidade)", "price": 6.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Frango", "Catupiry", "Massa"]},
  {"id": 49, "name": "Enroladinho de Salsicha", "description": "Enroladinho de salsicha assado (unidade)", "price": 5.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Salsicha", "Massa", "Queijo"]},
  {"id": 50, "name": "Torta Salgada", "description": "Torta salgada de frango e milho (média)", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Frango", "Milho", "Massa", "Creme de leite", "Queijo"]},
  {"id": 51, "name": "Pudim de Leite", "description": "Pudim de leite condensado tradicional", "price": 45.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Leite condensado", "Leite", "Ovos", "Açúcar"]},
  {"id": 52, "name": "Pudim de Chocolate", "description": "Pudim de chocolate com calda de brigadeiro", "price": 52.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Chocolate", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 53, "name": "Pudim de Coco", "description": "Pudim de coco com calda de caramelo", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Coco", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 54, "name": "Pudim de Leite Ninho", "description": "Pudim de leite Ninho cremoso", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Leite Ninho", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 55, "name": "Pudim de Doce de Leite", "description": "Pudim de doce de leite com calda", "price": 53.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Doce de leite", "Leite", "Ovos", "Açúcar"]},
  {"id": 56, "name": "Pudim de Maracujá", "description": "Pudim de maracujá com calda azedinha", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Maracujá", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 57, "name": "Pudim de Paçoca", "description": "Pudim de paçoca com calda de amendoim", "price": 54.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Amendoim", "Paçoca", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 58, "name": "Pudim de Café", "description": "Pudim de café com calda de caramelo", "price": 52.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Café", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 59, "name": "Pudim Fit", "description": "Pudim diet sem açúcar", "price": 48.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Leite condensado diet", "Ovos", "Adoçante"]},
  {"id": 60, "name": "Pudim de Queijo", "description": "Pudim de queijo com goiabada", "price": 56.0, "imageUrl": undefined, "available": true, "category": {"id": 6, "name": "Pudim"}, "ingredients": ["Queijo", "Goiabada", "Leite condensado", "Ovos", "Açúcar"]},
  {"id": 61, "name": "Cesta Manhã Especial", "description": "Cesta com pão de mel, bolo e suco", "price": 89.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Pão de mel", "Bolo de cenoura", "Suco natural"]},
  {"id": 62, "name": "Cesta Café da Tarde", "description": "Cesta com variedade de quitandas", "price": 75.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Biscoitos", "Bolo de fubá", "Torradas", "Geléia"]},
  {"id": 63, "name": "Cesta Romântica", "description": "Cesta para casal com champanhe e doces finos", "price": 150.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Champanhe", "Doces finos", "Bombons", "Flores"]},
  {"id": 64, "name": "Cesta de Páscoa", "description": "Cesta temática com ovos de páscoa artesanais", "price": 120.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Ovo de páscoa", "Bombons", "Coelho de pelúcia"]},
  {"id": 65, "name": "Cesta Aniversário", "description": "Cesta com bolo personalizado e salgados", "price": 130.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Bolo personalizado", "Coxinha", "Empada", "Docinhos"]},
  {"id": 66, "name": "Cesta Natalina", "description": "Cesta de Natal com panetone e frutas secas", "price": 160.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Panetone", "Frutas secas", "Castanhas", "Vinho"]},
  {"id": 67, "name": "Cesta Fit", "description": "Cesta com produtos diet e integrais", "price": 95.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Bolo fit", "Cookie integral", "Pão de mel diet", "Suco detox"]},
  {"id": 68, "name": "Mini Cesta", "description": "Mini cesta com 3 doces variados", "price": 45.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Brigadeiro", "Beijinho", "Cajuzinho"]},
  {"id": 69, "name": "Cesta de Doces Finos", "description": "Cesta com variedade de doces gourmet", "price": 110.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Trufas", "Mousses", "Copinhos da felicidade", "Bombons"]},
  {"id": 70, "name": "Cesta Empresarial", "description": "Cesta corporativa com café especial e biscoitos", "price": 135.0, "imageUrl": undefined, "available": true, "category": {"id": 7, "name": "Cesta"}, "ingredients": ["Café especial", "Biscoitos finos", "Pão de mel", "Geleia"]},
  {"id": 71, "name": "Bolo de Chocolate Congelado", "description": "Bolo de chocolate pronto para servir (rende 15 fatias)", "price": 80.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Chocolate", "Farinha", "Açúcar", "Ovos", "Creme de leite"]},
  {"id": 72, "name": "Bolo de Cenoura Congelado", "description": "Bolo de cenoura congelado com cobertura", "price": 75.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Cenoura", "Chocolate", "Farinha", "Açúcar", "Ovos"]},
  {"id": 73, "name": "Torta de Frango Congelada", "description": "Torta salgada de frango congelada (média)", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Frango", "Massa", "Milho", "Creme de leite"]},
  {"id": 74, "name": "Empadinhas Congeladas (12 unid)", "description": "12 empadinhas de frango congeladas", "price": 45.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Frango", "Catupiry", "Massa podre"]},
  {"id": 75, "name": "Coxinhas Congeladas (20 unid)", "description": "20 coxinhas de frango congeladas", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Frango", "Massa", "Temperos"]},
  {"id": 76, "name": "Pão de Mel Congelado", "description": "Pão de mel congelado recheado (10 unid)", "price": 50.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Mel", "Chocolate", "Doce de leite", "Farinha"]},
  {"id": 77, "name": "Pudim Congelado", "description": "Pudim de leite congelado (rende 10 fatias)", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Leite condensado", "Leite", "Ovos", "Açúcar"]},
  {"id": 78, "name": "Massa de Pastel Congelada", "description": "Massa de pastel para fritar (20 discos)", "price": 25.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Farinha", "Óleo", "Sal"]},
  {"id": 79, "name": "Biscoitos Congelados (30 unid)", "description": "30 biscoitos de nata congelados para assar", "price": 35.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Nata", "Farinha", "Açúcar"]},
  {"id": 80, "name": "Kit Festa Congelado", "description": "Kit com 50 salgadinhos variados congelados", "price": 70.0, "imageUrl": undefined, "available": true, "category": {"id": 8, "name": "Congelado"}, "ingredients": ["Coxinha", "Empada", "Kibe", "Risole"]},
];

// ---- Usuários mock (login demo) ----
const mockAdminUser: BackendUser = {"id": 900, "name": "Neide", "email": "admin@neide.com", "phone": "11999999999", "role": "ADMIN"};
const mockCustomerUser: BackendUser = {"id": 1, "name": "Everton", "email": "everton@gmail.com", "phone": "11933548635", "role": "USER"};

// ---- Pedidos (snapshot real do banco; cópia mutável em memória) ----
const initialOrders: BackendOrder[] = [
  {"id": 1, "customerName": "Teste", "phone": "00000000000", "delivery": false, "address": undefined, "latitude": undefined, "longitude": undefined, "observation": undefined, "status": "FILA", "deliveryDateTime": undefined, "createdAt": "2026-06-17T16:55:45.787000+00:00", "items": [{"id": 1, "product": {"id": 2, "name": "Bolo de Fubá", "description": "Bolo de fubá cremoso tradicional", "price": 55.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Fubá", "Leite", "Ovos", "Açúcar", "Queijo"]}, "quantity": 1, "observation": undefined, "unitPrice": 55.0}]},
  {"id": 2, "customerName": "Gustavo", "phone": "11995095240", "delivery": true, "address": "Rua Joaquim Cirino da Silva, 52", "latitude": undefined, "longitude": undefined, "observation": "Colocar uma embalagem discreta", "status": "FILA", "deliveryDateTime": "2026-06-20T23:00:00+00:00", "createdAt": "2026-06-17T18:42:18.620000+00:00", "items": [{"id": 2, "product": {"id": 1, "name": "Bolo de Cenoura", "description": "Bolo de cenoura 45x45 com cobertura de chocolate", "price": 65.0, "imageUrl": undefined, "available": true, "category": {"id": 1, "name": "Caseiro"}, "ingredients": ["Cenoura", "Chocolate", "Farinha de trigo", "Açúcar", "Ovos"]}, "quantity": 2, "observation": "Quero o sem cobertura", "unitPrice": 65.0}]},
  {"id": 3, "customerName": "Gustavo Rodrigues", "phone": "5181084848", "delivery": true, "address": "Gsgsgw", "latitude": undefined, "longitude": undefined, "observation": undefined, "status": "FILA", "deliveryDateTime": "2026-09-02T02:04:00+00:00", "createdAt": "2026-09-01T23:04:38.210000+00:00", "items": [{"id": 3, "product": {"id": 44, "name": "Risole de Carne", "description": "Risole de carne moída (unidade)", "price": 7.0, "imageUrl": undefined, "available": true, "category": {"id": 5, "name": "Salgado"}, "ingredients": ["Carne moída", "Farinha", "Temperos"]}, "quantity": 1, "observation": undefined, "unitPrice": 7.0}]},
];
// ---- Estado mutável em memória (CRUD do admin e checkout funcionam no mock) ----
let products = initialProducts.map((p) => ({ ...p }));
const orders = initialOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) }));
let nextProductId = Math.max(...products.map((p) => p.id)) + 1;
let nextOrderId = Math.max(...orders.map((o) => o.id)) + 1;

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** Mesma interface do `api` real — permite troca 1:1 no lib/api.ts. */
export const mockApi = {
  // Auth (demo: email com "admin" entra como ADMIN, resto como USER)
  login: async (dto: BackendLoginDTO) => {
    await mockDelay();
    if (!dto.email || !dto.password) throw new Error("Credenciais inválidas");
    return clone(dto.email.toLowerCase().includes("admin") ? mockAdminUser : mockCustomerUser);
  },

  register: async (dto: BackendRegisterDTO) => {
    await mockDelay();
    const created: BackendUser = {
      id: Date.now(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: "USER",
    };
    return created;
  },

  // Categories
  getCategories: async () => {
    await mockDelay();
    return clone(mockCategories);
  },

  createCategory: async (data: { name: string }) => {
    await mockDelay();
    const created: BackendCategory = {
      id: Math.max(...mockCategories.map((c) => c.id)) + 1,
      name: data.name,
    };
    mockCategories.push(created);
    return clone(created);
  },

  updateCategory: async (id: number, data: { name: string }) => {
    await mockDelay();
    const cat = mockCategories.find((c) => c.id === id);
    if (!cat) throw new Error("HTTP 404");
    cat.name = data.name;
    return clone(cat);
  },

  deleteCategory: async (id: number) => {
    await mockDelay();
    const index = mockCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("HTTP 404");
    mockCategories.splice(index, 1);
  },

  // Products
  getProducts: async (categoryId?: number) => {
    await mockDelay();
    const list = categoryId
      ? products.filter((p) => p.category?.id === categoryId)
      : products;
    return clone(list);
  },

  getProduct: async (id: number) => {
    await mockDelay();
    const found = products.find((p) => p.id === id);
    if (!found) throw new Error("HTTP 404");
    return clone(found);
  },

  createProduct: async (data: Partial<BackendProduct>) => {
    await mockDelay();
    const created: BackendProduct = {
      id: nextProductId++,
      name: data.name ?? "Novo produto",
      description: data.description,
      price: data.price ?? 0,
      imageUrl: data.imageUrl,
      available: data.available ?? true,
      category: data.category,
      ingredients: data.ingredients,
    };
    products.push(created);
    return clone(created);
  },

  updateProduct: async (id: number, data: Partial<BackendProduct>) => {
    await mockDelay();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("HTTP 404");
    products[index] = { ...products[index], ...data, id };
    return clone(products[index]);
  },

  toggleProduct: async (id: number) => {
    await mockDelay();
    const found = products.find((p) => p.id === id);
    if (!found) throw new Error("HTTP 404");
    found.available = !found.available;
    return clone(found);
  },

  deleteProduct: async (id: number) => {
    await mockDelay();
    products = products.filter((p) => p.id !== id);
  },

  // Orders
  getOrders: async (status?: string) => {
    await mockDelay();
    const list = status ? orders.filter((o) => o.status === status) : orders;
    return clone(list);
  },

  getOrder: async (id: number) => {
    await mockDelay();
    const found = orders.find((o) => o.id === id);
    if (!found) throw new Error("HTTP 404");
    return clone(found);
  },

  getOrdersByCustomer: async (name: string) => {
    await mockDelay();
    return clone(
      orders.filter((o) =>
        o.customerName.toLowerCase().includes(name.toLowerCase())
      )
    );
  },

  createOrder: async (dto: BackendOrderDTO) => {
    await mockDelay();
    if (dto.items.length === 0) throw new Error("Pedido sem itens");
    const created: BackendOrder = {
      id: nextOrderId++,
      customerName: dto.customerName,
      phone: dto.phone,
      delivery: dto.delivery,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      observation: dto.observation,
      status: "FILA",
      deliveryDateTime: dto.deliveryDateTime,
      createdAt: new Date().toISOString(),
      items: dto.items.map((item, i) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          id: Date.now() + i,
          product: product ?? {
            id: item.productId,
            name: `Produto #${item.productId}`,
            price: 0,
            available: true,
          },
          quantity: item.quantity,
          observation: item.observation,
          unitPrice: product?.price ?? 0,
        };
      }),
    };
    orders.push(created);
    return clone(created);
  },

  advanceOrder: async (id: number) => {
    await mockDelay();
    return mockApi.updateOrderStatus(id, nextStatus(id));
  },

  updateOrderStatus: async (id: number, status: string) => {
    await mockDelay();
    const found = orders.find((o) => o.id === id);
    if (!found) throw new Error("HTTP 404");
    found.status = status;
    return clone(found);
  },

  // Images (mock não faz upload real)
  uploadImage: async () => {
    await mockDelay();
    return { url: "/bolo.webp" };
  },
};

function nextStatus(id: number): string {
  const flow = ["FILA", "APROVADO", "FAZENDO", "PRONTO"];
  const found = orders.find((o) => o.id === id);
  const index = flow.indexOf(found?.status ?? "FILA");
  return flow[Math.min(index + 1, flow.length - 1)];
}
